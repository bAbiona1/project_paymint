import { useState, useEffect, useCallback } from 'react';
import { supabase, type Invoice } from '../lib/supabase';
import { useAuth } from './useAuth';

interface DashboardMetrics {
  totalRevenue: number;
  outstanding: number;
  totalInvoices: number;
  overdueCount: number;
  paidCount: number;
  pendingCount: number;
}

interface MonthlyRevenue {
  month: string;
  amount: number;
}

interface RecentActivity {
  recentInvoices: Invoice[];
}

export function useDashboard(timeRange: string = '12months') {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [monthlyRevenue, setMonthlyRevenue] = useState<MonthlyRevenue[]>([]);
  const [recentActivity, setRecentActivity] = useState<RecentActivity>({ recentInvoices: [] });
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!user) return;
    setLoading(true);

    // Fetch all non-draft invoices for metrics
    const { data: allInvoices } = await supabase
      .from('invoices')
      .select('*, client:clients(name)')
      .eq('user_id', user.id)
      .neq('status', 'cancelled')
      .order('created_at', { ascending: false });

    const invoices = allInvoices || [];

    const totalRevenue = invoices.reduce((sum, inv) => sum + Number(inv.amount_paid), 0);
    const outstanding = invoices
      .filter((inv) => ['sent', 'partially_paid', 'overdue'].includes(inv.status))
      .reduce((sum, inv) => sum + Number(inv.balance_due), 0);
    const totalInvoices = invoices.filter((inv) => inv.status !== 'draft').length;
    const overdueCount = invoices.filter((inv) => inv.status === 'overdue').length;
    const paidCount = invoices.filter((inv) => inv.status === 'paid').length;
    const pendingCount = invoices.filter((inv) => ['sent', 'partially_paid'].includes(inv.status)).length;

    setMetrics({ totalRevenue, outstanding, totalInvoices, overdueCount, paidCount, pendingCount });

    // Monthly revenue from payments
    const monthsBack = timeRange === '7days' ? 1 : timeRange === '30days' ? 2 : timeRange === '6months' ? 6 : 12;
    const { data: payments } = await supabase
      .from('payments')
      .select('amount, payment_date')
      .eq('user_id', user.id)
      .gte('payment_date', new Date(Date.now() - monthsBack * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);

    const monthMap = new Map<string, number>();
    const now = new Date();

    for (let i = monthsBack - 1; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      monthMap.set(key, 0);
    }

    for (const p of payments || []) {
      const d = new Date(p.payment_date);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      if (monthMap.has(key)) {
        monthMap.set(key, (monthMap.get(key) || 0) + Number(p.amount));
      }
    }

    const revenue: MonthlyRevenue[] = [];
    for (const [key, amount] of monthMap) {
      const [year, month] = key.split('-');
      const d = new Date(Number(year), Number(month) - 1, 1);
      revenue.push({
        month: d.toLocaleDateString('en-US', { month: 'short' }),
        amount,
      });
    }

    setMonthlyRevenue(revenue);

    // Recent invoices
    const recent = invoices.slice(0, 8);
    setRecentActivity({ recentInvoices: recent });

    setLoading(false);
  }, [user, timeRange]);

  useEffect(() => { fetchData(); }, [fetchData]);

  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel('dashboard-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'invoices', filter: `user_id=eq.${user.id}` }, () => { fetchData(); })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'payments', filter: `user_id=eq.${user.id}` }, () => { fetchData(); })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user, fetchData]);

  return { metrics, monthlyRevenue, recentActivity, loading, refetch: fetchData };
}
