import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, FileDown, ExternalLink } from 'lucide-react';
import { useReceipt } from '../../hooks/useReceipts';
import { useAuth } from '../../hooks/useAuth';
import Button from '../../components/ui/Button';
import Logo from '../../components/Logo';
import { formatCurrency, formatDate } from '../../lib/utils';
import type { Invoice, Client, InvoiceItem } from '../../lib/supabase';

export default function ReceiptDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { receipt, loading } = useReceipt(id);
  const { profile } = useAuth();

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="skeleton h-6 w-40" />
        <div className="skeleton h-96 w-full max-w-[640px] mx-auto rounded-xl" />
      </div>
    );
  }

  if (!receipt) {
    return (
      <div className="text-center py-16">
        <p className="text-[var(--paymint-text-tertiary)]">Receipt not found.</p>
        <Button variant="ghost" onClick={() => navigate('/app/receipts')} className="mt-4">Back</Button>
      </div>
    );
  }

  const inv = receipt.invoice as Invoice & { client: Client; invoice_items: InvoiceItem[] };
  const client = inv?.client;

  return (
    <div>
      {/* Actions bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 print:hidden">
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={() => navigate('/app/receipts')}
            className="p-1.5 rounded-md text-[var(--paymint-text-tertiary)] hover:bg-[var(--paymint-surface-subtle)] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <h1 className="text-xl font-semibold font-mono text-[var(--paymint-text-primary)]">{receipt.receipt_number}</h1>
        </div>
        <div className="flex gap-2">
          {inv && (
            <Link to={`/app/invoices/${inv.id}`}>
              <Button variant="secondary" size="sm" icon={<ExternalLink className="w-3.5 h-3.5" />}>
                View Invoice
              </Button>
            </Link>
          )}
          <Button
            size="sm"
            icon={<FileDown className="w-3.5 h-3.5" />}
            onClick={() => window.print()}
          >
            Export PDF
          </Button>
        </div>
      </div>

      {/* Receipt document */}
      <div className="max-w-[640px] mx-auto bg-white border border-[var(--paymint-surface-border)] rounded-xl shadow-lg overflow-hidden w-full min-w-0 print:shadow-none print:border-none">
        {/* Brand bar */}
        <div className="h-1 bg-[var(--paymint-primary-600)]" />

        <div className="p-4 sm:p-8 lg:p-10">
          {/* Header */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            <div>
              <Logo size="sm" />
              {profile?.business_name && (
                <p className="text-sm text-[var(--paymint-text-secondary)] mt-1">{profile.business_name}</p>
              )}
              {profile?.business_address && (
                <p className="text-xs text-[var(--paymint-text-tertiary)]">{profile.business_address}</p>
              )}
            </div>
            <div className="text-left sm:text-right">
              <p className="text-xs font-semibold tracking-[0.08em] uppercase text-[var(--paymint-text-tertiary)] mb-2">Receipt</p>
              <p className="text-sm font-mono font-semibold text-[var(--paymint-text-primary)]">{receipt.receipt_number}</p>
              <p className="text-xs text-[var(--paymint-text-tertiary)] mt-1">
                Invoice: <span className="font-mono">{inv?.invoice_number}</span>
              </p>
              <p className="text-xs text-[var(--paymint-text-tertiary)]">
                Date: {formatDate(receipt.issued_at)}
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-[var(--paymint-surface-border)] mb-6" />

          {/* Client */}
          <div className="mb-6">
            <p className="text-xs font-semibold tracking-wider uppercase text-[var(--paymint-text-tertiary)] mb-2">
              Received From
            </p>
            <p className="text-sm font-semibold text-[var(--paymint-text-primary)]">{client?.name}</p>
            {(client as Client & { company?: string })?.company && (
              <p className="text-sm text-[var(--paymint-text-secondary)]">{(client as Client & { company?: string }).company}</p>
            )}
            {client?.email && (
              <p className="text-sm text-[var(--paymint-text-secondary)]">{client.email}</p>
            )}
          </div>

          {/* Services */}
          {inv?.invoice_items && inv.invoice_items.length > 0 && (
            <div className="mb-6">
              <p className="text-xs font-semibold tracking-wider uppercase text-[var(--paymint-text-tertiary)] mb-3">
                Services Rendered
              </p>
              <div className="space-y-1.5">
                {inv.invoice_items.map((item) => (
                  <div key={item.id} className="flex justify-between gap-4 text-sm">
                    <span className="text-[var(--paymint-text-secondary)] italic">{item.description}</span>
                    <span className="font-mono text-[var(--paymint-text-primary)] flex-shrink-0">{formatCurrency(item.line_total)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Divider */}
          <div className="border-t border-[var(--paymint-surface-border)] mb-6" />

          {/* Total */}
          <div
            className="flex justify-between items-center p-4 rounded-lg mb-6"
            style={{ backgroundColor: 'var(--paymint-success-bg)', borderLeft: '4px solid var(--paymint-success-text)' }}
          >
            <div>
              <p className="text-xs font-semibold tracking-wider uppercase text-[var(--paymint-success-text)]">
                Total Received
              </p>
              <p className="text-2xl font-bold font-mono text-[var(--paymint-text-primary)] mt-0.5">
                {formatCurrency(receipt.total_paid)}
              </p>
            </div>
          </div>

          {/* Notes */}
          {receipt.notes && (
            <p className="text-sm text-[var(--paymint-text-secondary)] mb-6">{receipt.notes}</p>
          )}

          {/* Footer */}
          <div className="border-t border-[var(--paymint-surface-divider)] pt-6">
            <p className="text-sm text-center font-display italic text-[var(--paymint-text-tertiary)]">
              Thank you for your business.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
