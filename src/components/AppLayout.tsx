import { useState, type ReactNode } from 'react';
import { Menu } from 'lucide-react';
import Sidebar from './Sidebar';
import Logo from './Logo';

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[var(--paymint-surface-bg)] overflow-hidden">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile top bar */}
        <header className="lg:hidden h-14 bg-white border-b border-[var(--paymint-surface-border)] flex items-center justify-between px-4 flex-shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-1.5 rounded-md text-[var(--paymint-text-secondary)] hover:bg-[var(--paymint-surface-subtle)]"
          >
            <Menu className="w-5 h-5" />
          </button>
          <Logo size="sm" />
          <div className="w-8" />
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          <div className="max-w-[1200px] mx-auto px-4 lg:px-8 py-6 lg:py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
