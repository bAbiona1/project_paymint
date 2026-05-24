import { useState, useEffect, useCallback } from 'react';
import { supabase, type Invoice, type InvoiceItem, type Payment, type Receipt, type InvoiceStatus } from '../lib/supabase';
import { useAuth } from './useAuth';

export function useInvoices(statusFilter?: InvoiceStatus | 'all', search?: string) {
  const { user } = useAuth();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    let query = supabase
      .from('invoices')
      .select('*, client:clients(*)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (statusFilter && statusFilter !== 'all') {
      query = query.eq('status', statusFilter);
    }

    const { data } = await query;

    let filtered = data || [];
    if (search) {
      const s = search.toLowerCase();
      filtered = filtered.filter(
        (inv) =>
          inv.invoice_number.toLowerCase().includes(s) ||
          (inv.client as { name: string })?.name?.toLowerCase().includes(s)
      );
    }

    setInvoices(filtered);
    setLoading(false);
  }, [user, statusFilter, search]);

  useEffect(() => { fetch(); }, [fetch]);

  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel('invoices-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'invoices', filter: `user_id=eq.${user.id}` }, () => {
        fetch();
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user, fetch]);

  return { invoices, loading, refetch: fetch };
}

export function useInvoice(id: string | undefined) {
  const { user } = useAuth();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    if (!user || !id) return;
    setLoading(true);

    const [invRes, itemsRes, paymentsRes, receiptRes] = await Promise.all([
      supabase.from('invoices').select('*, client:clients(*)').eq('id', id).eq('user_id', user.id).maybeSingle(),
      supabase.from('invoice_items').select('*').eq('invoice_id', id).order('sort_order'),
      supabase.from('payments').select('*').eq('invoice_id', id).order('payment_date'),
      supabase.from('receipts').select('*').eq('invoice_id', id).maybeSingle(),
    ]);

    setInvoice(invRes.data);
    setItems(itemsRes.data || []);
    setPayments(paymentsRes.data || []);
    setReceipt(receiptRes.data);
    setLoading(false);
  }, [user, id]);

  useEffect(() => { fetch(); }, [fetch]);

  return { invoice, items, payments, receipt, loading, refetch: fetch };
}

export function useInvoiceMutations() {
  const { user, profile } = useAuth();

  async function createInvoice(
    data: {
      client_id: string;
      invoice_number: string;
      issue_date: string;
      due_date: string;
      status: InvoiceStatus;
      notes?: string;
      payment_terms?: string;
      discount_type?: 'flat' | 'percent' | null;
      discount_value?: number;
    },
    items: Array<{ description: string; quantity: number; unit_price: number; tax_rate: number }>
  ) {
    if (!user) return { error: 'Not authenticated', id: null };

    // Calculate totals
    const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unit_price, 0);
    const tax_total = items.reduce((sum, item) => sum + item.quantity * item.unit_price * (item.tax_rate / 100), 0);
    let discount_amount = 0;
    if (data.discount_type === 'flat') discount_amount = data.discount_value || 0;
    if (data.discount_type === 'percent') discount_amount = ((subtotal + tax_total) * (data.discount_value || 0)) / 100;
    const total = subtotal + tax_total - discount_amount;

    const { data: inv, error } = await supabase
      .from('invoices')
      .insert({
        user_id: user.id,
        client_id: data.client_id,
        invoice_number: data.invoice_number,
        issue_date: data.issue_date,
        due_date: data.due_date || null,
        status: data.status,
        subtotal,
        tax_total,
        discount_type: data.discount_type || null,
        discount_value: data.discount_value || 0,
        discount_amount,
        total,
        amount_paid: 0,
        notes: data.notes || null,
        payment_terms: data.payment_terms || null,
      })
      .select()
      .single();

    if (error) return { error: error.message, id: null };

    // Insert items
    const itemsToInsert = items.map((item, idx) => ({
      invoice_id: inv.id,
      user_id: user.id,
      description: item.description,
      quantity: item.quantity,
      unit_price: item.unit_price,
      tax_rate: item.tax_rate,
      tax_amount: item.quantity * item.unit_price * (item.tax_rate / 100),
      sort_order: idx,
    }));

    await supabase.from('invoice_items').insert(itemsToInsert);

    // Increment invoice number
    if (profile) {
      await supabase
        .from('profiles')
        .update({ next_invoice_number: profile.next_invoice_number + 1 })
        .eq('id', user.id);
    }

    return { error: null, id: inv.id };
  }

  async function updateInvoiceStatus(id: string, status: InvoiceStatus) {
    const updates: Record<string, unknown> = { status };
    if (status === 'sent') updates.sent_at = new Date().toISOString();
    if (status === 'paid') updates.paid_at = new Date().toISOString();
    const { error } = await supabase.from('invoices').update(updates).eq('id', id);
    return { error: error?.message || null };
  }

  async function recordPayment(
    invoiceId: string,
    amount: number,
    paymentDate: string,
    paymentMethod?: string,
    notes?: string
  ) {
    if (!user) return { error: 'Not authenticated' };

    // Get current invoice
    const { data: inv } = await supabase
      .from('invoices')
      .select('*')
      .eq('id', invoiceId)
      .maybeSingle();

    if (!inv) return { error: 'Invoice not found' };

    // Insert payment
    const { error: payError } = await supabase.from('payments').insert({
      invoice_id: invoiceId,
      user_id: user.id,
      amount,
      payment_date: paymentDate,
      payment_method: paymentMethod || null,
      notes: notes || null,
    });

    if (payError) return { error: payError.message };

    // Update invoice amount_paid and status
    const newAmountPaid = Number(inv.amount_paid) + amount;
    const newTotal = Number(inv.total);
    let newStatus: InvoiceStatus = inv.status;

    if (newAmountPaid >= newTotal) {
      newStatus = 'paid';
    } else if (newAmountPaid > 0) {
      newStatus = 'partially_paid';
    }

    const invoiceUpdates: Record<string, unknown> = { amount_paid: newAmountPaid, status: newStatus };
    if (newStatus === 'paid') invoiceUpdates.paid_at = new Date().toISOString();

    const { error: invError } = await supabase
      .from('invoices')
      .update(invoiceUpdates)
      .eq('id', invoiceId);

    if (invError) return { error: invError.message };

    // Auto-generate receipt if now paid
    if (newStatus === 'paid') {
      // Get next receipt sequence
      const { count } = await supabase
        .from('receipts')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      const seq = (count || 0) + 1;
      const year = new Date().getFullYear();
      const receiptNumber = `REC-${year}-${String(seq).padStart(4, '0')}`;

      await supabase.from('receipts').insert({
        invoice_id: invoiceId,
        user_id: user.id,
        receipt_number: receiptNumber,
        total_paid: newAmountPaid,
      });
    }

    return { error: null };
  }

  async function deleteInvoice(id: string) {
    const { error } = await supabase.from('invoices').delete().eq('id', id);
    return { error: error?.message || null };
  }

  async function duplicateInvoice(id: string) {
    if (!user || !profile) return { error: 'Not authenticated', newId: null };

    const { data: inv } = await supabase
      .from('invoices')
      .select('*, invoice_items(*)')
      .eq('id', id)
      .maybeSingle();

    if (!inv) return { error: 'Invoice not found', newId: null };

    const newNumber = `${profile.invoice_prefix}-${profile.next_invoice_number}`;
    const { data: newInv, error } = await supabase
      .from('invoices')
      .insert({
        user_id: user.id,
        client_id: inv.client_id,
        invoice_number: newNumber,
        issue_date: new Date().toISOString().split('T')[0],
        due_date: inv.due_date,
        status: 'draft',
        subtotal: inv.subtotal,
        tax_total: inv.tax_total,
        discount_type: inv.discount_type,
        discount_value: inv.discount_value,
        discount_amount: inv.discount_amount,
        total: inv.total,
        amount_paid: 0,
        notes: inv.notes,
        payment_terms: inv.payment_terms,
      })
      .select()
      .single();

    if (error) return { error: error.message, newId: null };

    const items = (inv as Invoice & { invoice_items: InvoiceItem[] }).invoice_items || [];
    if (items.length > 0) {
      await supabase.from('invoice_items').insert(
        items.map((item: InvoiceItem) => ({
          invoice_id: newInv.id,
          user_id: user.id,
          description: item.description,
          quantity: item.quantity,
          unit_price: item.unit_price,
          tax_rate: item.tax_rate,
          tax_amount: item.tax_amount,
          sort_order: item.sort_order,
        }))
      );
    }

    await supabase.from('profiles').update({ next_invoice_number: profile.next_invoice_number + 1 }).eq('id', user.id);

    return { error: null, newId: newInv.id };
  }

  return { createInvoice, updateInvoiceStatus, recordPayment, deleteInvoice, duplicateInvoice };
}
