import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, Building2, MapPin, Plus, Eye, FileText } from 'lucide-react';
import { useClient } from '../../hooks/useClients';
import { useInvoices } from '../../hooks/useInvoices';
import Button from '../../components/ui/Button';
import StatusBadge from '../../components/ui/StatusBadge';
import { formatCurrency, formatDate, getInitials } from '../../lib/utils';
import type { Invoice } from '../../lib/supabase';

export default function ClientDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { client, loading } = useClient(id);
  const { invoices } = useInvoices(undefined, undefined);

  const clientInvoices = invoices.filter((inv) => inv.client_id === id);
  const totalBilled = clientInvoices.reduce((sum, inv) => sum + Number(inv.total), 0);
  const totalPaid = clientInvoices.reduce((sum, inv) => sum + Number(inv.amount_paid), 0);

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="skeleton h-6 w-40" />
        <div className="skeleton h-40 w-full rounded-xl" />
      </div>
    );
  }

  if (!client) {
    return (
      <div className="text-center py-16">
        <p className="text-[var(--paymint-text-tertiary)]">Client not found.</p>
        <Button variant="ghost" onClick={() => navigate('/app/clients')} className="mt-4">Back to clients</Button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate('/app/clients')}
          className="p-1.5 rounded-md text-[var(--paymint-text-tertiary)] hover:bg-[var(--paymint-surface-subtle)] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[var(--paymint-primary-100)] overflow-hidden flex items-center justify-center flex-shrink-0">
            {client.notes?.startsWith('LOGO_DATA:') ? (
              <img src={client.notes.split('|||')[0].replace('LOGO_DATA:', '')} className="w-full h-full object-cover" alt="" />
            ) : (
              <span className="text-xs font-semibold text-[var(--paymint-primary-700)]">
                {getInitials(client.name)}
              </span>
            )}
          </div>
          <h1 className="text-2xl font-semibold text-[var(--paymint-text-primary)] tracking-tight">{client.name}</h1>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        {/* Client info */}
        <div className="lg:col-span-2 bg-white border border-[var(--paymint-surface-border)] rounded-xl p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-[var(--paymint-text-primary)] mb-4">Contact Details</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {client.company && (
              <div className="flex items-start gap-2.5">
                <Building2 className="w-4 h-4 text-[var(--paymint-text-tertiary)] mt-0.5" />
                <div>
                  <p className="text-xs text-[var(--paymint-text-tertiary)]">Company</p>
                  <p className="text-sm text-[var(--paymint-text-primary)]">{client.company}</p>
                </div>
              </div>
            )}
            {client.email && (
              <div className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-[var(--paymint-text-tertiary)] mt-0.5" />
                <div>
                  <p className="text-xs text-[var(--paymint-text-tertiary)]">Email</p>
                  <a href={`mailto:${client.email}`} className="text-sm text-[var(--paymint-primary-600)] hover:underline">
                    {client.email}
                  </a>
                </div>
              </div>
            )}
            {client.phone && (
              <div className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-[var(--paymint-text-tertiary)] mt-0.5" />
                <div>
                  <p className="text-xs text-[var(--paymint-text-tertiary)]">Phone</p>
                  <p className="text-sm text-[var(--paymint-text-primary)]">{client.phone}</p>
                </div>
              </div>
            )}
            {(client.address || client.city) && (
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[var(--paymint-text-tertiary)] mt-0.5" />
                <div>
                  <p className="text-xs text-[var(--paymint-text-tertiary)]">Address</p>
                  <p className="text-sm text-[var(--paymint-text-primary)]">
                    {[client.address, client.city, client.country].filter(Boolean).join(', ')}
                  </p>
                </div>
              </div>
            )}
          </div>
          {client.notes && (
            <div className="mt-4 pt-4 border-t border-[var(--paymint-surface-divider)]">
              <p className="text-xs text-[var(--paymint-text-tertiary)] mb-1">Notes</p>
              <p className="text-sm text-[var(--paymint-text-secondary)]">
                {client.notes.startsWith('LOGO_DATA:') ? client.notes.split('|||')[1] || '' : client.notes}
              </p>
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="space-y-4">
          <div className="bg-white border border-[var(--paymint-surface-border)] rounded-xl p-5 shadow-sm">
            <p className="text-xs text-[var(--paymint-text-tertiary)] mb-1">Total Billed</p>
            <p className="text-2xl font-semibold font-mono text-[var(--paymint-text-primary)]">{formatCurrency(totalBilled)}</p>
          </div>
          <div className="bg-white border border-[var(--paymint-surface-border)] rounded-xl p-5 shadow-sm">
            <p className="text-xs text-[var(--paymint-text-tertiary)] mb-1">Total Paid</p>
            <p className="text-2xl font-semibold font-mono text-[var(--paymint-text-primary)]">{formatCurrency(totalPaid)}</p>
          </div>
          <div className="bg-white border border-[var(--paymint-surface-border)] rounded-xl p-5 shadow-sm">
            <p className="text-xs text-[var(--paymint-text-tertiary)] mb-1">Invoices</p>
            <p className="text-2xl font-semibold font-mono text-[var(--paymint-text-primary)]">{clientInvoices.length}</p>
          </div>
        </div>
      </div>

      {/* Invoices */}
      <div className="bg-white border border-[var(--paymint-surface-border)] rounded-xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--paymint-surface-border)]">
          <h2 className="text-base font-semibold text-[var(--paymint-text-primary)]">Invoices</h2>
          <Link to={`/app/invoices/new?client=${id}`}>
            <Button size="sm" icon={<Plus className="w-3.5 h-3.5" />}>Create Invoice</Button>
          </Link>
        </div>

        {clientInvoices.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-10 h-10 rounded-xl bg-[var(--paymint-surface-subtle)] flex items-center justify-center mb-3">
              <FileText className="w-5 h-5 text-[var(--paymint-text-tertiary)]" />
            </div>
            <p className="text-sm font-medium text-[var(--paymint-text-primary)] mb-1">No invoices for this client.</p>
            <p className="text-xs text-[var(--paymint-text-tertiary)]">Create an invoice assigned to this client.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[var(--paymint-surface-bg)] border-b border-[var(--paymint-surface-border)]">
                  <th className="text-left px-6 py-2.5 text-[10px] font-semibold tracking-wider uppercase text-[var(--paymint-text-tertiary)]">Invoice</th>
                  <th className="text-left px-4 py-2.5 text-[10px] font-semibold tracking-wider uppercase text-[var(--paymint-text-tertiary)]">Date</th>
                  <th className="text-right px-4 py-2.5 text-[10px] font-semibold tracking-wider uppercase text-[var(--paymint-text-tertiary)]">Total</th>
                  <th className="text-center px-4 py-2.5 text-[10px] font-semibold tracking-wider uppercase text-[var(--paymint-text-tertiary)]">Status</th>
                  <th className="px-4 py-2.5 w-12" />
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--paymint-surface-divider)]">
                {clientInvoices.map((inv: Invoice) => (
                  <tr key={inv.id} className="hover:bg-[var(--paymint-surface-subtle)] transition-colors duration-[80ms]">
                    <td className="px-6 py-3.5 font-mono text-sm font-medium text-[var(--paymint-text-primary)]">{inv.invoice_number}</td>
                    <td className="px-4 py-3.5 text-sm text-[var(--paymint-text-secondary)]">{formatDate(inv.issue_date)}</td>
                    <td className="px-4 py-3.5 text-right text-sm font-semibold font-mono text-[var(--paymint-text-primary)]">{formatCurrency(inv.total)}</td>
                    <td className="px-4 py-3.5 text-center"><StatusBadge status={inv.status} /></td>
                    <td className="px-4 py-3.5">
                      <Link
                        to={`/app/invoices/${inv.id}`}
                        className="p-1.5 rounded-md text-[var(--paymint-text-tertiary)] hover:bg-[var(--paymint-surface-subtle)] transition-colors inline-flex"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
