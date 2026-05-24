import { Link } from 'react-router-dom';
import { Receipt as ReceiptIcon, Eye, FileText } from 'lucide-react';
import { useReceipts } from '../../hooks/useReceipts';
import StatusBadge from '../../components/ui/StatusBadge';
import { formatCurrency, formatDate } from '../../lib/utils';
import type { Invoice, Client } from '../../lib/supabase';

export default function Receipts() {
  const { receipts, loading } = useReceipts();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-[var(--paymint-text-primary)] tracking-tight">Receipts</h1>
        <p className="text-sm text-[var(--paymint-text-tertiary)] mt-0.5">
          Auto-generated when invoices are paid.
        </p>
      </div>

      <div className="bg-white border border-[var(--paymint-surface-border)] rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-4">
            {Array(4).fill(0).map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="skeleton h-3.5 w-28" />
                <div className="skeleton h-3.5 w-32 flex-1" />
                <div className="skeleton h-3.5 w-20" />
              </div>
            ))}
          </div>
        ) : receipts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-12 h-12 rounded-xl bg-[var(--paymint-surface-subtle)] flex items-center justify-center mb-4">
              <ReceiptIcon className="w-6 h-6 text-[var(--paymint-text-tertiary)]" />
            </div>
            <p className="text-base font-semibold text-[var(--paymint-text-primary)] mb-1">No receipts yet</p>
            <p className="text-sm text-[var(--paymint-text-tertiary)] mb-5 max-w-[280px]">
              Receipts appear automatically when invoices are fully paid.
            </p>
            <Link
              to="/app/invoices"
              className="text-sm font-medium text-[var(--paymint-primary-600)] hover:underline"
            >
              View Invoices →
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[var(--paymint-surface-bg)] border-b border-[var(--paymint-surface-border)]">
                  <th className="text-left px-6 py-2.5 text-[10px] font-semibold tracking-wider uppercase text-[var(--paymint-text-tertiary)]">Receipt</th>
                  <th className="text-left px-4 py-2.5 text-[10px] font-semibold tracking-wider uppercase text-[var(--paymint-text-tertiary)]">Invoice</th>
                  <th className="text-left px-4 py-2.5 text-[10px] font-semibold tracking-wider uppercase text-[var(--paymint-text-tertiary)]">Client</th>
                  <th className="text-left px-4 py-2.5 text-[10px] font-semibold tracking-wider uppercase text-[var(--paymint-text-tertiary)] hidden sm:table-cell">Issued</th>
                  <th className="text-right px-4 py-2.5 text-[10px] font-semibold tracking-wider uppercase text-[var(--paymint-text-tertiary)]">Total Paid</th>
                  <th className="text-center px-4 py-2.5 text-[10px] font-semibold tracking-wider uppercase text-[var(--paymint-text-tertiary)] hidden sm:table-cell">Status</th>
                  <th className="px-4 py-2.5 w-12" />
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--paymint-surface-divider)]">
                {receipts.map((r) => {
                  const inv = r.invoice as Invoice & { client: Client };
                  return (
                    <tr key={r.id} className="hover:bg-[var(--paymint-surface-subtle)] transition-colors duration-[80ms]">
                      <td className="px-6 py-3.5 font-mono text-sm font-medium text-[var(--paymint-text-primary)]">
                        {r.receipt_number}
                      </td>
                      <td className="px-4 py-3.5 font-mono text-sm text-[var(--paymint-text-secondary)]">
                        {inv?.invoice_number || '—'}
                      </td>
                      <td className="px-4 py-3.5 text-sm text-[var(--paymint-text-primary)]">
                        {inv?.client?.name || '—'}
                      </td>
                      <td className="px-4 py-3.5 text-sm text-[var(--paymint-text-secondary)] hidden sm:table-cell">
                        {formatDate(r.issued_at)}
                      </td>
                      <td className="px-4 py-3.5 text-right text-sm font-semibold font-mono text-[var(--paymint-success-text)]">
                        {formatCurrency(r.total_paid)}
                      </td>
                      <td className="px-4 py-3.5 text-center hidden sm:table-cell">
                        <StatusBadge status="paid" />
                      </td>
                      <td className="px-4 py-3.5">
                        <Link
                          to={`/app/receipts/${r.id}`}
                          className="p-1.5 rounded-md text-[var(--paymint-text-tertiary)] hover:bg-[var(--paymint-surface-subtle)] hover:text-[var(--paymint-text-primary)] transition-colors inline-flex"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {receipts.length > 0 && (
        <p className="mt-4 text-xs text-[var(--paymint-text-tertiary)] flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5" />
          {receipts.length} receipt{receipts.length !== 1 ? 's' : ''} generated
        </p>
      )}
    </div>
  );
}
