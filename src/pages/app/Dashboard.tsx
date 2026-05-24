import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { DollarSign, AlertCircle, FileText, TrendingUp, Plus, Eye } from 'lucide-react';
import { useDashboard } from '../../hooks/useDashboard';
import { useAuth } from '../../hooks/useAuth';
import StatusBadge from '../../components/ui/StatusBadge';
import Button from '../../components/ui/Button';
import { formatCurrency, formatDate } from '../../lib/utils';
import type { Invoice } from '../../lib/supabase';

const timeRanges = [
  { label: '12 months', value: '12months' },
  { label: '6 months', value: '6months' },
  { label: '30 days', value: '30days' },
  { label: '7 days', value: '7days' },
];

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[var(--paymint-text-primary)] text-white rounded-lg px-3 py-1.5 text-sm font-mono">
      <p className="text-xs text-[var(--paymint-primary-200)] mb-0.5">{label}</p>
      <p className="font-semibold">{formatCurrency(payload[0].value)}</p>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-white border border-[var(--paymint-surface-border)] rounded-xl p-6">
      <div className="skeleton h-3 w-20 mb-4" />
      <div className="skeleton h-8 w-32 mb-2" />
      <div className="skeleton h-3 w-24" />
    </div>
  );
}

export default function Dashboard() {
  const { profile } = useAuth();
  const [timeRange, setTimeRange] = useState('12months');
  const { metrics, monthlyRevenue, recentActivity, loading } = useDashboard(timeRange);

  const kpiCards = [
    {
      label: 'Total Revenue',
      value: metrics ? formatCurrency(metrics.totalRevenue) : '—',
      icon: DollarSign,
      sub: 'All-time collected',
    },
    {
      label: 'Outstanding',
      value: metrics ? formatCurrency(metrics.outstanding) : '—',
      icon: AlertCircle,
      sub: 'Unpaid & overdue',
    },
    {
      label: 'Total Invoices',
      value: metrics ? String(metrics.totalInvoices) : '—',
      icon: FileText,
      sub: `${metrics?.paidCount ?? 0} paid · ${metrics?.pendingCount ?? 0} pending`,
    },
    {
      label: 'Overdue',
      value: metrics ? String(metrics.overdueCount) : '—',
      icon: TrendingUp,
      sub: metrics?.overdueCount ? 'Requires attention' : 'All on track',
    },
  ];

  const firstName = profile?.full_name?.split(' ')[0] || 'there';

  return (
    <div>
      {/* Page header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--paymint-text-primary)] tracking-tight">
            Hello, {firstName}
          </h1>
          <p className="text-sm text-[var(--paymint-text-tertiary)] mt-0.5">
            Here's your financial overview.
          </p>
        </div>
        <Link to="/app/invoices/new">
          <Button icon={<Plus className="w-4 h-4" />}>New Invoice</Button>
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {loading
          ? Array(4).fill(0).map((_, i) => <SkeletonCard key={i} />)
          : kpiCards.map(({ label, value, icon: Icon, sub }) => (
              <div
                key={label}
                className="bg-white border border-[var(--paymint-surface-border)] rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-[var(--paymint-surface-subtle)] flex items-center justify-center">
                    <Icon className="w-4 h-4 text-[var(--paymint-text-tertiary)]" />
                  </div>
                  <span className="text-xs font-medium text-[var(--paymint-text-secondary)]">{label}</span>
                </div>
                <p className="text-2xl font-semibold font-mono text-[var(--paymint-text-primary)] tracking-tight mb-1">
                  {value}
                </p>
                <p className="text-xs text-[var(--paymint-text-tertiary)]">{sub}</p>
              </div>
            ))}
      </div>

      {/* Revenue Chart */}
      <div className="bg-white border border-[var(--paymint-surface-border)] rounded-xl p-6 mb-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-base font-semibold text-[var(--paymint-text-primary)]">Revenue</h2>
          <div className="flex gap-1">
            {timeRanges.map(({ label, value }) => (
              <button
                key={value}
                onClick={() => setTimeRange(value)}
                className={`h-8 px-3 text-xs font-medium rounded-full transition-colors whitespace-nowrap ${
                  timeRange === value
                    ? 'bg-[var(--paymint-text-primary)] text-white'
                    : 'text-[var(--paymint-text-secondary)] hover:bg-[var(--paymint-surface-subtle)]'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="skeleton h-[220px] w-full rounded-lg" />
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthlyRevenue} barSize={28}>
              <CartesianGrid vertical={false} stroke="var(--paymint-surface-divider)" />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: 'var(--paymint-text-tertiary)' }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: 'var(--paymint-text-tertiary)' }}
                tickFormatter={(v) => (v >= 1000 ? `$${(v / 1000).toFixed(0)}k` : `$${v}`)}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--paymint-surface-subtle)' }} />
              <Bar
                dataKey="amount"
                fill="var(--paymint-primary-600)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Recent Invoices */}
      <div className="bg-white border border-[var(--paymint-surface-border)] rounded-xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--paymint-surface-border)]">
          <h2 className="text-base font-semibold text-[var(--paymint-text-primary)]">Recent Invoices</h2>
          <Link
            to="/app/invoices"
            className="text-xs font-medium text-[var(--paymint-primary-600)] hover:underline"
          >
            View all
          </Link>
        </div>

        {loading ? (
          <div className="p-6 space-y-4">
            {Array(4).fill(0).map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="space-y-1.5">
                  <div className="skeleton h-3.5 w-32" />
                  <div className="skeleton h-3 w-20" />
                </div>
                <div className="skeleton h-5 w-16 rounded-full" />
              </div>
            ))}
          </div>
        ) : recentActivity.recentInvoices.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-12 h-12 rounded-xl bg-[var(--paymint-surface-subtle)] flex items-center justify-center mb-4">
              <FileText className="w-6 h-6 text-[var(--paymint-text-tertiary)]" />
            </div>
            <p className="text-base font-semibold text-[var(--paymint-text-primary)] mb-1">No invoices yet</p>
            <p className="text-sm text-[var(--paymint-text-tertiary)] mb-5 max-w-[240px]">
              Create your first invoice to start tracking revenue.
            </p>
            <Link to="/app/invoices/new">
              <Button size="sm" icon={<Plus className="w-3.5 h-3.5" />}>Create Invoice</Button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[var(--paymint-surface-bg)] border-b border-[var(--paymint-surface-border)]">
                  <th className="text-left px-6 py-2.5 text-[10px] font-semibold tracking-wider uppercase text-[var(--paymint-text-tertiary)]">Invoice</th>
                  <th className="text-left px-4 py-2.5 text-[10px] font-semibold tracking-wider uppercase text-[var(--paymint-text-tertiary)]">Client</th>
                  <th className="text-left px-4 py-2.5 text-[10px] font-semibold tracking-wider uppercase text-[var(--paymint-text-tertiary)]">Date</th>
                  <th className="text-right px-4 py-2.5 text-[10px] font-semibold tracking-wider uppercase text-[var(--paymint-text-tertiary)]">Total</th>
                  <th className="text-center px-4 py-2.5 text-[10px] font-semibold tracking-wider uppercase text-[var(--paymint-text-tertiary)]">Status</th>
                  <th className="px-4 py-2.5" />
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--paymint-surface-divider)]">
                {recentActivity.recentInvoices.map((inv: Invoice) => (
                  <tr key={inv.id} className="hover:bg-[var(--paymint-surface-subtle)] transition-colors duration-[80ms]">
                    <td className="px-6 py-3.5">
                      <span className="text-sm font-medium font-mono text-[var(--paymint-text-primary)]">
                        {inv.invoice_number}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-sm text-[var(--paymint-text-primary)]">
                        {(inv.client as { name: string })?.name || '—'}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-sm text-[var(--paymint-text-secondary)]">{formatDate(inv.issue_date)}</span>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <span className="text-sm font-semibold font-mono text-[var(--paymint-text-primary)]">
                        {formatCurrency(inv.total)}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <StatusBadge status={inv.status} />
                    </td>
                    <td className="px-4 py-3.5">
                      <Link
                        to={`/app/invoices/${inv.id}`}
                        className="p-1.5 rounded-md text-[var(--paymint-text-tertiary)] hover:bg-[var(--paymint-surface-subtle)] hover:text-[var(--paymint-text-primary)] transition-colors inline-flex"
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
