import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Search, Eye, Trash2, Copy, FileText } from 'lucide-react';
import { useInvoices, useInvoiceMutations } from '../../hooks/useInvoices';
import Button from '../../components/ui/Button';
import StatusBadge from '../../components/ui/StatusBadge';
import Modal from '../../components/ui/Modal';
import { formatCurrency, formatDate } from '../../lib/utils';
import type { Invoice, InvoiceStatus } from '../../lib/supabase';
import { toast } from 'sonner';

const TABS: { label: string; value: InvoiceStatus | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Draft', value: 'draft' },
  { label: 'Sent', value: 'sent' },
  { label: 'Partial', value: 'partially_paid' },
  { label: 'Paid', value: 'paid' },
  { label: 'Overdue', value: 'overdue' },
];

export default function Invoices() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<InvoiceStatus | 'all'>('all');
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const { invoices, loading } = useInvoices(tab, search);
  const { deleteInvoice, duplicateInvoice } = useInvoiceMutations();

  async function handleDelete() {
    if (!deleteId) return;
    setDeleting(true);
    const { error } = await deleteInvoice(deleteId);
    setDeleting(false);
    if (error) toast.error('Failed to delete invoice');
    else {
      toast.success('Invoice deleted');
      setDeleteId(null);
    }
  }

  async function handleDuplicate(id: string) {
    const { error, newId } = await duplicateInvoice(id);
    if (error) toast.error('Failed to duplicate invoice');
    else {
      toast.success('Invoice duplicated');
      if (newId) navigate(`/app/invoices/${newId}`);
    }
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--paymint-text-primary)] tracking-tight">Invoices</h1>
          <p className="text-sm text-[var(--paymint-text-tertiary)] mt-0.5">Manage and track all your invoices.</p>
        </div>
        <Link to="/app/invoices/new">
          <Button icon={<Plus className="w-4 h-4" />}>New Invoice</Button>
        </Link>
      </div>

      {/* Table card */}
      <div className="bg-white border border-[var(--paymint-surface-border)] rounded-xl shadow-sm overflow-hidden">
        {/* Tabs + Search */}
        <div className="px-6 pt-4 border-b border-[var(--paymint-surface-border)]">
          <div className="flex items-center justify-between mb-3 gap-4">
            <div className="relative flex-shrink-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--paymint-text-tertiary)]" />
              <input
                className="h-8 w-56 rounded-md border border-[var(--paymint-surface-border)] pl-8 pr-3 text-xs bg-[var(--paymint-surface-subtle)] focus:outline-none focus:ring-2 focus:ring-[var(--paymint-primary-100)] focus:border-[var(--paymint-primary-600)] focus:bg-white transition-colors"
                placeholder="Search invoices…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-6 overflow-x-auto no-scrollbar">
            {TABS.map(({ label, value }) => (
              <button
                key={value}
                onClick={() => setTab(value)}
                className={`text-sm font-medium pb-3 border-b-2 whitespace-nowrap transition-colors ${
                  tab === value
                    ? 'text-[var(--paymint-primary-600)] border-[var(--paymint-primary-600)]'
                    : 'text-[var(--paymint-text-secondary)] border-transparent hover:text-[var(--paymint-text-primary)]'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="p-6 space-y-4">
            {Array(5).fill(0).map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="skeleton h-3.5 w-24" />
                <div className="skeleton h-3.5 w-32 flex-1" />
                <div className="skeleton h-3.5 w-20" />
                <div className="skeleton h-5 w-16 rounded-full" />
              </div>
            ))}
          </div>
        ) : invoices.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-12 h-12 rounded-xl bg-[var(--paymint-surface-subtle)] flex items-center justify-center mb-4">
              <FileText className="w-6 h-6 text-[var(--paymint-text-tertiary)]" />
            </div>
            <p className="text-base font-semibold text-[var(--paymint-text-primary)] mb-1">
              {search ? 'No invoices found' : 'No invoices yet'}
            </p>
            <p className="text-sm text-[var(--paymint-text-tertiary)] mb-5 max-w-[240px]">
              {search ? 'Try a different search or filter.' : 'Create your first invoice to get started.'}
            </p>
            {!search && (
              <Link to="/app/invoices/new">
                <Button size="sm" icon={<Plus className="w-3.5 h-3.5" />}>Create Invoice</Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[var(--paymint-surface-bg)] border-b border-[var(--paymint-surface-border)]">
                  <th className="text-left px-6 py-2.5 text-[10px] font-semibold tracking-wider uppercase text-[var(--paymint-text-tertiary)]">Invoice</th>
                  <th className="text-left px-4 py-2.5 text-[10px] font-semibold tracking-wider uppercase text-[var(--paymint-text-tertiary)]">Client</th>
                  <th className="text-left px-4 py-2.5 text-[10px] font-semibold tracking-wider uppercase text-[var(--paymint-text-tertiary)] hidden md:table-cell">Date</th>
                  <th className="text-left px-4 py-2.5 text-[10px] font-semibold tracking-wider uppercase text-[var(--paymint-text-tertiary)] hidden md:table-cell">Due</th>
                  <th className="text-right px-4 py-2.5 text-[10px] font-semibold tracking-wider uppercase text-[var(--paymint-text-tertiary)]">Total</th>
                  <th className="text-right px-4 py-2.5 text-[10px] font-semibold tracking-wider uppercase text-[var(--paymint-text-tertiary)] hidden sm:table-cell">Balance</th>
                  <th className="text-center px-4 py-2.5 text-[10px] font-semibold tracking-wider uppercase text-[var(--paymint-text-tertiary)]">Status</th>
                  <th className="px-4 py-2.5 w-24" />
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--paymint-surface-divider)]">
                {invoices.map((inv: Invoice) => (
                  <tr
                    key={inv.id}
                    className="hover:bg-[var(--paymint-surface-subtle)] transition-colors duration-[80ms] cursor-pointer"
                    onClick={() => navigate(`/app/invoices/${inv.id}`)}
                  >
                    <td className="px-6 py-3.5">
                      <span className="text-sm font-medium font-mono text-[var(--paymint-text-primary)]">
                        {inv.invoice_number}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div>
                        <p className="text-sm text-[var(--paymint-text-primary)]">
                          {(inv.client as { name: string; company?: string })?.name || '—'}
                        </p>
                        {(inv.client as { company?: string })?.company && (
                          <p className="text-xs text-[var(--paymint-text-tertiary)]">
                            {(inv.client as { company?: string }).company}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 hidden md:table-cell text-sm text-[var(--paymint-text-secondary)]">
                      {formatDate(inv.issue_date)}
                    </td>
                    <td className="px-4 py-3.5 hidden md:table-cell text-sm text-[var(--paymint-text-secondary)]">
                      {formatDate(inv.due_date)}
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <span className="text-sm font-semibold font-mono text-[var(--paymint-text-primary)]">
                        {formatCurrency(inv.total)}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right hidden sm:table-cell">
                      <span className={`text-sm font-mono ${inv.balance_due > 0 ? 'text-[var(--paymint-text-primary)]' : 'text-[var(--paymint-text-tertiary)]'}`}>
                        {formatCurrency(inv.balance_due)}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <StatusBadge status={inv.status} />
                    </td>
                    <td className="px-4 py-3.5" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          to={`/app/invoices/${inv.id}`}
                          className="p-1.5 rounded-md text-[var(--paymint-text-tertiary)] hover:bg-[var(--paymint-surface-subtle)] hover:text-[var(--paymint-text-primary)] transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDuplicate(inv.id)}
                          className="p-1.5 rounded-md text-[var(--paymint-text-tertiary)] hover:bg-[var(--paymint-surface-subtle)] hover:text-[var(--paymint-text-primary)] transition-colors"
                          title="Duplicate"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        {inv.status === 'draft' && (
                          <button
                            onClick={() => setDeleteId(inv.id)}
                            className="p-1.5 rounded-md text-[var(--paymint-text-tertiary)] hover:bg-[var(--paymint-danger-bg)] hover:text-[var(--paymint-danger-text)] transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirm */}
      <Modal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Delete invoice"
        subtitle="This action cannot be undone."
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete} loading={deleting}>Delete</Button>
          </>
        }
      >
        <p className="text-sm text-[var(--paymint-text-secondary)] pb-2">
          Only draft invoices can be deleted. This will permanently remove the invoice and all its items.
        </p>
      </Modal>
    </div>
  );
}
