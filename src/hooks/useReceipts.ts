import { useState, useEffect, useCallback } from 'react';
import { supabase, type Receipt } from '../lib/supabase';
import { useAuth } from './useAuth';

export function useReceipts() {
  const { user } = useAuth();
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data } = await supabase
      .from('receipts')
      .select('*, invoice:invoices(*, client:clients(*))')
      .eq('user_id', user.id)
      .order('issued_at', { ascending: false });
    setReceipts(data || []);
    setLoading(false);
  }, [user]);

  useEffect(() => { fetch(); }, [fetch]);

  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel('receipts-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'receipts', filter: `user_id=eq.${user.id}` }, () => { fetch(); })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user, fetch]);

  return { receipts, loading, refetch: fetch };
}

export function useReceipt(id: string | undefined) {
  const { user } = useAuth();
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    if (!user || !id) return;
    setLoading(true);
    const { data } = await supabase
      .from('receipts')
      .select('*, invoice:invoices(*, client:clients(*), invoice_items(*))')
      .eq('id', id)
      .eq('user_id', user.id)
      .maybeSingle();
    setReceipt(data);
    setLoading(false);
  }, [user, id]);

  useEffect(() => { fetch(); }, [fetch]);

  return { receipt, loading, refetch: fetch };
}
