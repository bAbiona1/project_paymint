import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  Users,
  Receipt,
  Settings,
  LogOut,
  X,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import Logo from './Logo';
import { getInitials } from '../lib/utils';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const navItems = [
  { to: '/app/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/app/invoices', icon: FileText, label: 'Invoices' },
  { to: '/app/clients', icon: Users, label: 'Clients' },
  { to: '/app/receipts', icon: Receipt, label: 'Receipts' },
  { to: '/app/settings', icon: Settings, label: 'Settings' },
];

export default function Sidebar({ open, onClose }: SidebarProps) {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();

  async function handleSignOut() {
    await signOut();
    navigate('/login');
  }

  const displayName = profile?.full_name || profile?.email || 'User';
  const businessName = profile?.business_name || '';

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-[rgba(15,25,35,0.4)] lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-[240px] bg-white border-r border-[var(--paymint-surface-border)] flex flex-col
          transition-transform duration-[240ms] ease-out
          ${open ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static lg:z-auto
        `}
      >
        {/* Logo area */}
        <div className="h-14 px-4 flex items-center justify-between border-b border-[var(--paymint-surface-border)]">
          <Logo size="sm" />
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-md text-[var(--paymint-text-tertiary)] hover:bg-[var(--paymint-surface-subtle)]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-2.5 h-9 px-3 rounded-md text-sm transition-colors duration-[120ms] ${
                  isActive
                    ? 'bg-[var(--paymint-primary-50)] text-[var(--paymint-primary-600)] font-semibold'
                    : 'text-[var(--paymint-text-secondary)] hover:bg-[var(--paymint-surface-subtle)] font-medium'
                }`
              }
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* User section */}
        <div className="border-t border-[var(--paymint-surface-border)] p-3">
          <div className="flex items-center gap-2.5 px-2 py-2 rounded-md hover:bg-[var(--paymint-surface-subtle)] cursor-default transition-colors">
            <div className="w-7 h-7 rounded-full bg-[var(--paymint-primary-100)] flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-semibold text-[var(--paymint-primary-700)]">
                {getInitials(displayName)}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-[var(--paymint-text-primary)] truncate">{businessName || displayName}</p>
              <p className="text-[10px] text-[var(--paymint-text-tertiary)] truncate">{profile?.email}</p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="mt-1 flex items-center gap-2.5 h-9 px-3 w-full rounded-md text-sm font-medium text-[var(--paymint-text-tertiary)] hover:bg-[var(--paymint-surface-subtle)] hover:text-[var(--paymint-danger-text)] transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </div>
      </aside>
    </>
  );
}
