import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Plus, Trash2, ArrowLeft } from 'lucide-react';
import { useClients } from '../../hooks/useClients';
import { useInvoiceMutations } from '../../hooks/useInvoices';
import { useAuth } from '../../hooks/useAuth';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Textarea from '../../components/ui/Textarea';
import { formatCurrency } from '../../lib/utils';
import { toast } from 'sonner';

interface LineItem {
  description: string;
  quantity: number;
  unit_price: number;
  tax_rate: number;
}

const emptyItem = (): LineItem => ({ description: '', quantity: 1, unit_price: 0, tax_rate: 0 });

export default function CreateInvoice() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedClient = searchParams.get('client') || '';
  const { profile } = useAuth();
  const { clients } = useClients();
  const { createInvoice } = useInvoiceMutations();

  const today = new Date().toISOString().split('T')[0];
  const thirtyDays = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const [clientId, setClientId] = useState(preselectedClient);
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [issueDate, setIssueDate] = useState(today);
  const [dueDate, setDueDate] = useState(thirtyDays);
  const [status, setStatus] = useState<'draft' | 'sent'>('draft');
  const [notes, setNotes] = useState('');
  const [paymentTerms, setPaymentTerms] = useState('');
  const [discountType, setDiscountType] = useState<'flat' | 'percent' | ''>('');
  const [discountValue, setDiscountValue] = useState(0);
  const [items, setItems] = useState<LineItem[]>([emptyItem()]);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (profile) {
      setInvoiceNumber(`${profile.invoice_prefix}-${profile.next_invoice_number}`);
    }
  }, [profile]);

  function updateItem(idx: number, field: keyof LineItem, value: string | number) {
    setItems((prev) => prev.map((item, i) => i === idx ? { ...item, [field]: value } : item));
  }

  function addItem() {
    setItems((prev) => [...prev, emptyItem()]);
  }

  function removeItem(idx: number) {
    setItems((prev) => prev.filter((_, i) => i !== idx));
  }

  // Live calculations
  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unit_price, 0);
  const taxTotal = items.reduce((sum, item) => sum + item.quantity * item.unit_price * (item.tax_rate / 100), 0);
  let discountAmount = 0;
  if (discountType === 'flat') discountAmount = discountValue;
  if (discountType === 'percent') discountAmount = (subtotal + taxTotal) * (discountValue / 100);
  const total = subtotal + taxTotal - discountAmount;

  async function handleSave() {
    const errs: Record<string, string> = {};
    if (!clientId) errs.client = 'Please select a client';
    if (!invoiceNumber.trim()) errs.invoiceNumber = 'Invoice number is required';
    if (items.every((item) => !item.description.trim())) errs.items = 'Add at least one line item';
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setSaving(true);
    const { error, id } = await createInvoice(
      {
        client_id: clientId,
        invoice_number: invoiceNumber.trim(),
        issue_date: issueDate,
        due_date: dueDate,
        status,
        notes: notes || undefined,
        payment_terms: paymentTerms || undefined,
        discount_type: discountType || null,
        discount_value: discountValue,
      },
      items.filter((item) => item.description.trim())
    );
    setSaving(false);

    if (error) {
      toast.error(`Failed to create invoice: ${error}`);
    } else {
      toast.success(`Invoice ${invoiceNumber} created`);
      navigate(`/app/invoices/${id}`);
    }
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate('/app/invoices')}
          className="p-1.5 rounded-md text-[var(--paymint-text-tertiary)] hover:bg-[var(--paymint-surface-subtle)] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-2xl font-semibold text-[var(--paymint-text-primary)] tracking-tight">New Invoice</h1>
          <p className="text-sm text-[var(--paymint-text-tertiary)] mt-0.5">Fill in the details below.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Client & Invoice Info */}
          <div className="bg-white border border-[var(--paymint-surface-border)] rounded-xl p-6 shadow-sm">
            <h2 className="text-sm font-semibold text-[var(--paymint-text-primary)] mb-4">Invoice Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <Select
                  label="Client"
                  required
                  value={clientId}
                  onChange={(e) => { setClientId(e.target.value); setErrors((e) => ({ ...e, client: '' })); }}
                  error={errors.client}
                >
                  <option value="">Select a client…</option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}{c.company ? ` — ${c.company}` : ''}</option>
                  ))}
                </Select>
              </div>
              <Input
                label="Invoice number"
                required
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                error={errors.invoiceNumber}
                className="font-mono"
              />
              <Select
                label="Status"
                value={status}
                onChange={(e) => setStatus(e.target.value as 'draft' | 'sent')}
              >
                <option value="draft">Draft</option>
                <option value="sent">Sent</option>
              </Select>
              <Input
                label="Issue date"
                required
                type="date"
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
              />
              <Input
                label="Due date"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </div>

          {/* Line Items */}
          <div className="bg-white border border-[var(--paymint-surface-border)] rounded-xl p-6 shadow-sm">
            <h2 className="text-sm font-semibold text-[var(--paymint-text-primary)] mb-4">Line Items</h2>
            {errors.items && (
              <p className="text-xs text-[var(--paymint-danger-text)] mb-3">{errors.items}</p>
            )}

            {/* Header */}
            <div className="hidden sm:grid grid-cols-[1fr_80px_120px_80px_40px] gap-3 mb-2">
              <p className="text-xs font-medium text-[var(--paymint-text-tertiary)]">Description</p>
              <p className="text-xs font-medium text-[var(--paymint-text-tertiary)] text-right">Qty</p>
              <p className="text-xs font-medium text-[var(--paymint-text-tertiary)] text-right">Unit Price</p>
              <p className="text-xs font-medium text-[var(--paymint-text-tertiary)] text-right">Tax %</p>
              <div />
            </div>

            <div className="space-y-3">
              {items.map((item, idx) => (
                <div key={idx} className="sm:grid grid-cols-[1fr_80px_120px_80px_40px] gap-3 items-start space-y-2 sm:space-y-0">
                  <div>
                    <Input
                      placeholder="Description of service or product"
                      value={item.description}
                      onChange={(e) => updateItem(idx, 'description', e.target.value)}
                    />
                    <p className="text-xs text-[var(--paymint-text-tertiary)] mt-0.5 sm:hidden">
                      Line total: {formatCurrency(item.quantity * item.unit_price)}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs text-[var(--paymint-text-tertiary)] mb-1 sm:hidden block">Qty</label>
                    <Input
                      type="number"
                      min="0"
                      step="0.001"
                      value={item.quantity}
                      onChange={(e) => updateItem(idx, 'quantity', parseFloat(e.target.value) || 0)}
                      className="text-right"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-[var(--paymint-text-tertiary)] mb-1 sm:hidden block">Unit Price</label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.unit_price}
                      onChange={(e) => updateItem(idx, 'unit_price', parseFloat(e.target.value) || 0)}
                      className="text-right font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-[var(--paymint-text-tertiary)] mb-1 sm:hidden block">Tax %</label>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      value={item.tax_rate}
                      onChange={(e) => updateItem(idx, 'tax_rate', parseFloat(e.target.value) || 0)}
                      className="text-right"
                    />
                  </div>
                  <div className="flex items-center justify-end">
                    {items.length > 1 && (
                      <button
                        onClick={() => removeItem(idx)}
                        className="p-1.5 rounded-md text-[var(--paymint-text-tertiary)] hover:bg-[var(--paymint-danger-bg)] hover:text-[var(--paymint-danger-text)] transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={addItem}
              className="mt-4 flex items-center gap-1.5 text-sm font-medium text-[var(--paymint-primary-600)] hover:text-[var(--paymint-primary-500)] transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add line item
            </button>
          </div>

          {/* Notes & Terms */}
          <div className="bg-white border border-[var(--paymint-surface-border)] rounded-xl p-6 shadow-sm">
            <h2 className="text-sm font-semibold text-[var(--paymint-text-primary)] mb-4">Additional Details</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <Textarea
                label="Notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Payment due within 30 days. Bank transfer preferred."
              />
              <Input
                label="Payment terms"
                value={paymentTerms}
                onChange={(e) => setPaymentTerms(e.target.value)}
                placeholder="Net 30"
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-4 mt-4">
              <Select
                label="Discount type"
                value={discountType}
                onChange={(e) => setDiscountType(e.target.value as 'flat' | 'percent' | '')}
              >
                <option value="">No discount</option>
                <option value="flat">Flat amount</option>
                <option value="percent">Percentage</option>
              </Select>
              {discountType && (
                <Input
                  label={discountType === 'percent' ? 'Discount %' : 'Discount amount'}
                  type="number"
                  min="0"
                  step="0.01"
                  value={discountValue}
                  onChange={(e) => setDiscountValue(parseFloat(e.target.value) || 0)}
                />
              )}
            </div>
          </div>
        </div>

        {/* Summary sidebar */}
        <div className="space-y-4">
          <div className="bg-white border border-[var(--paymint-surface-border)] rounded-xl p-6 shadow-sm sticky top-6">
            <h2 className="text-sm font-semibold text-[var(--paymint-text-primary)] mb-4">Summary</h2>
            <div className="space-y-2.5">
              <div className="flex justify-between text-sm">
                <span className="text-[var(--paymint-text-secondary)]">Subtotal</span>
                <span className="font-mono text-[var(--paymint-text-primary)]">{formatCurrency(subtotal)}</span>
              </div>
              {taxTotal > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--paymint-text-secondary)]">Tax</span>
                  <span className="font-mono text-[var(--paymint-text-primary)]">{formatCurrency(taxTotal)}</span>
                </div>
              )}
              {discountAmount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--paymint-text-secondary)]">Discount</span>
                  <span className="font-mono text-[var(--paymint-danger-text)]">-{formatCurrency(discountAmount)}</span>
                </div>
              )}
              <div className="border-t border-[var(--paymint-surface-border)] pt-2.5 mt-2.5 flex justify-between">
                <span className="text-sm font-semibold text-[var(--paymint-text-primary)]">Total</span>
                <span className="text-lg font-semibold font-mono text-[var(--paymint-text-primary)]">
                  {formatCurrency(total)}
                </span>
              </div>
            </div>

            <div className="mt-6 space-y-2">
              <Button className="w-full" onClick={handleSave} loading={saving}>
                Save Invoice
              </Button>
              <Button variant="secondary" className="w-full" onClick={() => navigate('/app/invoices')}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
