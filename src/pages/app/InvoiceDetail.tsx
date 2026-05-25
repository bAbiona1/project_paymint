import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Receipt, CreditCard, FileDown, Send, RotateCcw } from 'lucide-react';
import { useInvoice, useInvoiceMutations } from '../../hooks/useInvoices';
import Button from '../../components/ui/Button';
import StatusBadge from '../../components/ui/StatusBadge';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Textarea from '../../components/ui/Textarea';
import { formatCurrency, formatDate } from '../../lib/utils';
import type { InvoiceStatus, Client } from '../../lib/supabase';
import { toast } from 'sonner';

const STATUS_OPTIONS: { label: string; value: InvoiceStatus }[] = [
  { label: 'Draft', value: 'draft' },
  { label: 'Sent', value: 'sent' },
  { label: 'Partially Paid', value: 'partially_paid' },
  { label: 'Paid', value: 'paid' },
  { label: 'Overdue', value: 'overdue' },
  { label: 'Cancelled', value: 'cancelled' },
];

export default function InvoiceDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { invoice, items, payments, receipt, loading, refetch } = useInvoice(id);
  const { updateInvoiceStatus, recordPayment } = useInvoiceMutations();

  const [showPayment, setShowPayment] = useState(false);
  const [payAmount, setPayAmount] = useState('');
  const [payDate, setPayDate] = useState(new Date().toISOString().split('T')[0]);
  const [payMethod, setPayMethod] = useState('');
  const [payNotes, setPayNotes] = useState('');
  const [payLoading, setPayLoading] = useState(false);
  const [payError, setPayError] = useState('');

  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState<InvoiceStatus>('draft');
  const [statusLoading, setStatusLoading] = useState(false);

  async function handlePayment() {
    const amount = parseFloat(payAmount);
    if (!payAmount || isNaN(amount) || amount <= 0) {
      setPayError('Enter a valid amount');
      return;
    }
    if (invoice && amount > invoice.balance_due) {
      setPayError(`Amount exceeds balance due (${formatCurrency(invoice.balance_due)})`);
      return;
    }
    setPayLoading(true);
    const { error } = await recordPayment(id!, amount, payDate, payMethod, payNotes);
    setPayLoading(false);
    if (error) {
      toast.error(`Payment failed: ${error}`);
    } else {
      toast.success('Payment recorded');
      setShowPayment(false);
      setPayAmount('');
      setPayNotes('');
      setPayMethod('');
      await refetch();
    }
  }

  async function handleStatusChange() {
    setStatusLoading(true);
    const { error } = await updateInvoiceStatus(id!, newStatus);
    setStatusLoading(false);
    if (error) toast.error('Failed to update status');
    else {
      toast.success('Status updated');
      setShowStatusModal(false);
      await refetch();
    }
  }

  async function handlePrintPDF() {
    window.print();
  }

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="skeleton h-6 w-40" />
        <div className="skeleton h-60 w-full rounded-xl" />
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="text-center py-16">
        <p className="text-[var(--paymint-text-tertiary)]">Invoice not found.</p>
        <Button variant="ghost" onClick={() => navigate('/app/invoices')} className="mt-4">Back</Button>
      </div>
    );
  }

  const client = invoice.client as Client & { company?: string };

  return (
    <div className="print:p-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 print:hidden">
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={() => navigate('/app/invoices')}
            className="p-1.5 rounded-md text-[var(--paymint-text-tertiary)] hover:bg-[var(--paymint-surface-subtle)] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-semibold font-mono text-[var(--paymint-text-primary)]">
              {invoice.invoice_number}
            </h1>
            <StatusBadge status={invoice.status} />
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="secondary"
            size="sm"
            icon={<RotateCcw className="w-3.5 h-3.5" />}
            onClick={() => { setNewStatus(invoice.status); setShowStatusModal(true); }}
          >
            Change Status
          </Button>
          <Button
            variant="secondary"
            size="sm"
            icon={<FileDown className="w-3.5 h-3.5" />}
            onClick={handlePrintPDF}
          >
            Export PDF
          </Button>
          {receipt && (
            <Link to={`/app/receipts/${receipt.id}`}>
              <Button
                variant="secondary"
                size="sm"
                icon={<Receipt className="w-3.5 h-3.5" />}
              >
                View Receipt
              </Button>
            </Link>
          )}
          {invoice.status !== 'paid' && invoice.status !== 'cancelled' && (
            <Button
              size="sm"
              icon={<CreditCard className="w-3.5 h-3.5" />}
              onClick={() => {
                setPayAmount(String(invoice.balance_due));
                setPayError('');
                setShowPayment(true);
              }}
            >
              Record Payment
            </Button>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Invoice body */}
        <div className="lg:col-span-2 space-y-6">
          {/* Parties */}
          <div className="bg-white border border-[var(--paymint-surface-border)] rounded-xl p-4 sm:p-6 shadow-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <p className="text-xs font-semibold tracking-wider uppercase text-[var(--paymint-text-tertiary)] mb-2">Bill To</p>
                <p className="text-sm font-semibold text-[var(--paymint-text-primary)]">{client?.name}</p>
                {client?.company && <p className="text-sm text-[var(--paymint-text-secondary)]">{client.company}</p>}
                {client?.email && <p className="text-sm text-[var(--paymint-text-secondary)]">{client.email}</p>}
                {client?.address && <p className="text-sm text-[var(--paymint-text-secondary)]">{client.address}</p>}
              </div>
              <div className="text-left sm:text-right">
                <p className="text-xs font-semibold tracking-wider uppercase text-[var(--paymint-text-tertiary)] mb-2">Invoice Details</p>
                <p className="text-sm text-[var(--paymint-text-secondary)]">
                  <span className="text-[var(--paymint-text-tertiary)]">Issued: </span>{formatDate(invoice.issue_date)}
                </p>
                {invoice.due_date && (
                  <p className="text-sm text-[var(--paymint-text-secondary)]">
                    <span className="text-[var(--paymint-text-tertiary)]">Due: </span>{formatDate(invoice.due_date)}
                  </p>
                )}
                {invoice.payment_terms && (
                  <p className="text-sm text-[var(--paymint-text-secondary)]">
                    <span className="text-[var(--paymint-text-tertiary)]">Terms: </span>{invoice.payment_terms}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Line items */}
          <div className="bg-white border border-[var(--paymint-surface-border)] rounded-xl shadow-sm overflow-hidden w-full min-w-0">
            <div className="overflow-x-auto w-full">
              <table className="w-full">
                <thead>
                  <tr className="bg-[var(--paymint-surface-bg)] border-b border-[var(--paymint-surface-border)]">
                    <th className="text-left px-6 py-2.5 text-[10px] font-semibold tracking-wider uppercase text-[var(--paymint-text-tertiary)]">Description</th>
                    <th className="text-right px-4 py-2.5 text-[10px] font-semibold tracking-wider uppercase text-[var(--paymint-text-tertiary)]">Qty</th>
                    <th className="text-right px-4 py-2.5 text-[10px] font-semibold tracking-wider uppercase text-[var(--paymint-text-tertiary)]">Rate</th>
                    <th className="text-right px-4 py-2.5 text-[10px] font-semibold tracking-wider uppercase text-[var(--paymint-text-tertiary)]">Tax</th>
                    <th className="text-right px-6 py-2.5 text-[10px] font-semibold tracking-wider uppercase text-[var(--paymint-text-tertiary)]">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--paymint-surface-divider)]">
                  {items.map((item) => (
                    <tr key={item.id}>
                      <td className="px-6 py-3.5 text-sm text-[var(--paymint-text-primary)]">{item.description}</td>
                      <td className="px-4 py-3.5 text-right text-sm text-[var(--paymint-text-secondary)] font-mono">{item.quantity}</td>
                      <td className="px-4 py-3.5 text-right text-sm font-mono text-[var(--paymint-text-secondary)]">{formatCurrency(item.unit_price)}</td>
                      <td className="px-4 py-3.5 text-right text-sm text-[var(--paymint-text-secondary)]">{item.tax_rate}%</td>
                      <td className="px-6 py-3.5 text-right text-sm font-semibold font-mono text-[var(--paymint-text-primary)]">
                        {formatCurrency(item.line_total + item.tax_amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="border-t border-[var(--paymint-surface-border)] px-4 sm:px-6 py-4">
              <div className="ml-auto max-w-[280px] w-full space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--paymint-text-secondary)]">Subtotal</span>
                  <span className="font-mono text-[var(--paymint-text-primary)]">{formatCurrency(invoice.subtotal)}</span>
                </div>
                {invoice.tax_total > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--paymint-text-secondary)]">Tax</span>
                    <span className="font-mono text-[var(--paymint-text-primary)]">{formatCurrency(invoice.tax_total)}</span>
                  </div>
                )}
                {invoice.discount_amount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--paymint-text-secondary)]">Discount</span>
                    <span className="font-mono text-[var(--paymint-danger-text)]">-{formatCurrency(invoice.discount_amount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-semibold border-t border-[var(--paymint-surface-border)] pt-2">
                  <span className="text-[var(--paymint-text-primary)]">Total</span>
                  <span className="font-mono text-[var(--paymint-text-primary)]">{formatCurrency(invoice.total)}</span>
                </div>
                {invoice.amount_paid > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--paymint-success-text)]">Paid</span>
                    <span className="font-mono text-[var(--paymint-text-primary)]">-{formatCurrency(invoice.amount_paid)}</span>
                  </div>
                )}
                {invoice.balance_due > 0 && (
                  <div className="flex justify-between text-base font-bold border-t border-[var(--paymint-surface-border)] pt-2">
                    <span className="text-[var(--paymint-text-primary)]">Balance Due</span>
                    <span className="font-mono text-[var(--paymint-text-primary)]">{formatCurrency(invoice.balance_due)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Notes */}
          {invoice.notes && (
            <div className="bg-white border border-[var(--paymint-surface-border)] rounded-xl p-6 shadow-sm">
              <p className="text-xs font-semibold tracking-wider uppercase text-[var(--paymint-text-tertiary)] mb-2">Notes</p>
              <p className="text-sm text-[var(--paymint-text-secondary)]">{invoice.notes}</p>
            </div>
          )}
        </div>

        {/* Right sidebar */}
        <div className="space-y-4 print:hidden">
          {/* Payment summary */}
          <div className="bg-white border border-[var(--paymint-surface-border)] rounded-xl p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-[var(--paymint-text-primary)] mb-4">Payment Summary</h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-[var(--paymint-text-tertiary)]">Invoice Total</p>
                <p className="text-lg font-semibold font-mono text-[var(--paymint-text-primary)]">{formatCurrency(invoice.total)}</p>
              </div>
              <div>
                <p className="text-xs text-[var(--paymint-text-tertiary)]">Amount Paid</p>
                <p className="text-lg font-semibold font-mono text-[var(--paymint-text-primary)]">{formatCurrency(invoice.amount_paid)}</p>
              </div>
              <div className="border-t border-[var(--paymint-surface-border)] pt-3">
                <p className="text-xs text-[var(--paymint-text-tertiary)]">Balance Due</p>
                <p className={`text-xl font-bold font-mono ${invoice.balance_due > 0 ? 'text-[var(--paymint-text-primary)]' : 'text-[var(--paymint-text-tertiary)]'}`}>
                  {formatCurrency(invoice.balance_due)}
                </p>
              </div>
            </div>
            {invoice.status !== 'paid' && invoice.status !== 'cancelled' && (
              <Button
                className="w-full mt-4"
                size="sm"
                icon={<CreditCard className="w-3.5 h-3.5" />}
                onClick={() => { setPayAmount(String(invoice.balance_due)); setPayError(''); setShowPayment(true); }}
              >
                Record Payment
              </Button>
            )}
          </div>

          {/* Payment history */}
          {payments.length > 0 && (
            <div className="bg-white border border-[var(--paymint-surface-border)] rounded-xl p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-[var(--paymint-text-primary)] mb-4">Payment History</h3>
              <div className="space-y-3">
                {payments.map((p) => (
                  <div key={p.id} className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-xs text-[var(--paymint-text-tertiary)]">{formatDate(p.payment_date)}</p>
                      {p.payment_method && (
                        <p className="text-xs text-[var(--paymint-text-secondary)]">{p.payment_method}</p>
                      )}
                      {p.notes && (
                        <p className="text-xs text-[var(--paymint-text-tertiary)] italic">{p.notes}</p>
                      )}
                    </div>
                    <span className="text-sm font-semibold font-mono text-[var(--paymint-text-primary)] flex-shrink-0">
                      {formatCurrency(p.amount)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Receipt link */}
          {receipt && (
            <div className="bg-[var(--paymint-success-bg)] border border-[var(--paymint-success-border)] rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Receipt className="w-4 h-4 text-[var(--paymint-success-text)]" />
                <p className="text-sm font-semibold text-[var(--paymint-success-text)]">Receipt Generated</p>
              </div>
              <p className="text-xs text-[var(--paymint-success-text)] mb-3 font-mono">{receipt.receipt_number}</p>
              <Link to={`/app/receipts/${receipt.id}`}>
                <Button size="sm" variant="secondary" className="w-full">View Receipt</Button>
              </Link>
            </div>
          )}

          {/* Quick actions */}
          <div className="bg-white border border-[var(--paymint-surface-border)] rounded-xl p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-[var(--paymint-text-primary)] mb-3">Actions</h3>
            <div className="space-y-2">
              {invoice.status === 'draft' && (
                <Button
                  variant="secondary"
                  size="sm"
                  className="w-full"
                  icon={<Send className="w-3.5 h-3.5" />}
                  onClick={async () => {
                    const { error } = await updateInvoiceStatus(id!, 'sent');
                    if (!error) { toast.success('Invoice marked as sent'); await refetch(); }
                  }}
                >
                  Mark as Sent
                </Button>
              )}
              <Button
                variant="secondary"
                size="sm"
                className="w-full"
                icon={<RotateCcw className="w-3.5 h-3.5" />}
                onClick={() => { setNewStatus(invoice.status); setShowStatusModal(true); }}
              >
                Change Status
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Record Payment Modal */}
      <Modal
        open={showPayment}
        onClose={() => setShowPayment(false)}
        title="Record Payment"
        subtitle={`Balance due: ${formatCurrency(invoice.balance_due)}`}
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setShowPayment(false)}>Cancel</Button>
            <Button onClick={handlePayment} loading={payLoading}>Record Payment</Button>
          </>
        }
      >
        <div className="space-y-4 pb-2">
          <Input
            label="Amount"
            required
            type="number"
            min="0.01"
            step="0.01"
            value={payAmount}
            onChange={(e) => { setPayAmount(e.target.value); setPayError(''); }}
            error={payError}
            className="font-mono"
          />
          <Input
            label="Payment date"
            required
            type="date"
            value={payDate}
            onChange={(e) => setPayDate(e.target.value)}
          />
          <Select
            label="Payment method"
            value={payMethod}
            onChange={(e) => setPayMethod(e.target.value)}
          >
            <option value="">Select method (optional)</option>
            <option value="Bank Transfer">Bank Transfer</option>
            <option value="Credit Card">Credit Card</option>
            <option value="PayPal">PayPal</option>
            <option value="Cash">Cash</option>
            <option value="Check">Check</option>
            <option value="Crypto">Crypto</option>
            <option value="Other">Other</option>
          </Select>
          <Textarea
            label="Notes"
            value={payNotes}
            onChange={(e) => setPayNotes(e.target.value)}
            placeholder="Optional notes about this payment…"
            className="min-h-[64px]"
          />
        </div>
      </Modal>

      {/* Status Change Modal */}
      <Modal
        open={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        title="Change Invoice Status"
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setShowStatusModal(false)}>Cancel</Button>
            <Button onClick={handleStatusChange} loading={statusLoading}>Update Status</Button>
          </>
        }
      >
        <div className="pb-2">
          <Select
            label="New status"
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value as InvoiceStatus)}
          >
            {STATUS_OPTIONS.map(({ label, value }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </Select>
        </div>
      </Modal>
    </div>
  );
}
