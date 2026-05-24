import { Link } from 'react-router-dom';
import { CheckCircle, FileText, CreditCard, BarChart3, Star } from 'lucide-react';
import Logo from '../components/Logo';

export default function Landing() {
  return (
    <div className="min-h-screen bg-white font-body">
      {/* Navbar */}
      <nav className="h-16 border-b border-[var(--paymint-surface-border)] px-6 lg:px-10 flex items-center justify-between bg-white sticky top-0 z-40">
        <Logo size="sm" />
        <div className="flex items-center gap-2">
          <Link
            to="/login"
            className="inline-flex items-center h-9 px-4 text-sm font-medium text-[var(--paymint-text-secondary)] hover:text-[var(--paymint-text-primary)] transition-colors"
          >
            Log in
          </Link>
          <Link
            to="/signup"
            className="h-9 px-4 text-sm font-semibold text-white bg-[var(--paymint-primary-600)] rounded-full hover:bg-[var(--paymint-primary-500)] transition-colors flex items-center"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-[1200px] mx-auto px-6 lg:px-10 pt-16 pb-24 lg:pt-20 lg:pb-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left */}
          <div>
            <p className="text-xs font-semibold tracking-[0.08em] uppercase text-[var(--paymint-primary-600)] mb-4">
              Invoicing for the solo economy
            </p>
            <h1 className="text-4xl lg:text-5xl font-semibold text-[var(--paymint-text-primary)] leading-[1.1] tracking-tight mb-2">
              Invoice smarter.
            </h1>
            <h1 className="text-4xl lg:text-5xl leading-[1.1] tracking-tight mb-6">
              <span className="font-display italic text-[var(--paymint-primary-600)]">Get paid faster.</span>
            </h1>
            <p className="text-base lg:text-lg text-[var(--paymint-text-secondary)] leading-relaxed mb-8 max-w-[440px]">
              Create professional invoices, track payments in real-time, and generate receipts automatically. Built for freelancers and consultants who value their time.
            </p>

            <div className="flex items-center gap-4 mb-8">
                <Link
                  to="/signup"
                  className="inline-flex items-center gap-2 h-9 px-4 text-sm font-semibold text-white bg-[var(--paymint-primary-600)] rounded-full hover:bg-[var(--paymint-primary-500)] transition-colors"
                >
                  Get Started
                </Link>
              <Link
                to="/login"
                className="text-sm font-medium text-[var(--paymint-text-secondary)] hover:text-[var(--paymint-text-primary)] transition-colors"
              >
                Sign in
              </Link>
            </div>

            {/* Social proof */}
            <div className="flex items-center gap-3">
              <div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                  <span className="ml-1 text-sm font-semibold text-[var(--paymint-text-primary)]">4.9</span>
                </div>
                <p className="text-xs text-[var(--paymint-text-tertiary)]">Trusted by 1,000+ freelancers</p>
              </div>
            </div>
          </div>

          {/* Right: Dashboard Preview */}
          <div className="relative">
            <div className="bg-white border border-[var(--paymint-surface-border)] rounded-2xl shadow-xl overflow-hidden">
              {/* Mini dashboard header */}
              <div className="bg-[var(--paymint-surface-bg)] px-5 py-3 border-b border-[var(--paymint-surface-border)] flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#f5b4b4]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#f5d87a]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#a7dfca]" />
                <div className="ml-2 text-xs text-[var(--paymint-text-tertiary)] font-medium">PayMint Dashboard</div>
              </div>

              <div className="p-5">
                {/* KPI row */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-[var(--paymint-primary-900)] rounded-xl p-4 text-white">
                    <p className="text-xs text-[var(--paymint-primary-200)] mb-1">Total Revenue</p>
                    <p className="text-2xl font-semibold font-mono tracking-tight">$24,350</p>
                    <p className="text-xs text-[var(--paymint-primary-300)] mt-1">↑ 12% this month</p>
                  </div>
                  <div className="bg-white border border-[var(--paymint-surface-border)] rounded-xl p-4">
                    <p className="text-xs text-[var(--paymint-text-tertiary)] mb-1">Outstanding</p>
                    <p className="text-2xl font-semibold font-mono tracking-tight text-[var(--paymint-text-primary)]">$8,200</p>
                    <p className="text-xs text-[var(--paymint-warning-text)] mt-1">3 invoices pending</p>
                  </div>
                </div>

                {/* Chart mockup */}
                <div className="bg-white border border-[var(--paymint-surface-border)] rounded-xl p-4 mb-4">
                  <p className="text-xs font-semibold text-[var(--paymint-text-secondary)] mb-3">Revenue</p>
                  <div className="flex items-end gap-1.5 h-14">
                    {[35, 55, 42, 68, 48, 72, 58, 80, 65, 90, 70, 95].map((h, i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-t-sm transition-all"
                        style={{
                          height: `${h}%`,
                          backgroundColor: i === 11 ? 'var(--paymint-primary-600)' : 'var(--paymint-surface-border)',
                        }}
                      />
                    ))}
                  </div>
                  <div className="flex justify-between mt-1.5">
                    {['Jan', 'Apr', 'Jul', 'Oct', 'Dec'].map((m) => (
                      <span key={m} className="text-[10px] text-[var(--paymint-text-tertiary)]">{m}</span>
                    ))}
                  </div>
                </div>

                {/* Recent invoices */}
                <div className="space-y-2">
                  {[
                    { client: 'Acme Corp', num: 'INV-1024', amount: '$4,200', status: 'paid' },
                    { client: 'TechFlow Inc', num: 'INV-1023', amount: '$2,800', status: 'sent' },
                    { client: 'Studio Nova', num: 'INV-1022', amount: '$1,500', status: 'overdue' },
                  ].map((inv) => (
                    <div key={inv.num} className="flex items-center justify-between py-1.5 border-b border-[var(--paymint-surface-divider)] last:border-0">
                      <div>
                        <p className="text-xs font-medium text-[var(--paymint-text-primary)]">{inv.client}</p>
                        <p className="text-[10px] text-[var(--paymint-text-tertiary)] font-mono">{inv.num}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold font-mono text-[var(--paymint-text-primary)]">{inv.amount}</span>
                        <span
                          className="text-[10px] px-1.5 py-0.5 rounded-full font-medium border"
                          style={{
                            backgroundColor: inv.status === 'paid' ? 'var(--paymint-success-bg)' : inv.status === 'sent' ? 'var(--paymint-info-bg)' : 'var(--paymint-danger-bg)',
                            color: inv.status === 'paid' ? 'var(--paymint-success-text)' : inv.status === 'sent' ? 'var(--paymint-info-text)' : 'var(--paymint-danger-text)',
                            borderColor: inv.status === 'paid' ? 'var(--paymint-success-border)' : inv.status === 'sent' ? 'var(--paymint-info-border)' : 'var(--paymint-danger-border)',
                          }}
                        >
                          {inv.status === 'paid' ? 'Paid' : inv.status === 'sent' ? 'Sent' : 'Overdue'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-[var(--paymint-surface-bg)] py-20 border-t border-[var(--paymint-surface-border)]">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold text-[var(--paymint-text-primary)] tracking-tight mb-3">
              Everything you need to get paid
            </h2>
            <p className="text-base text-[var(--paymint-text-secondary)] max-w-[480px] mx-auto">
              A complete invoicing workflow, from client management to receipt generation.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: FileText,
                title: 'Professional Invoices',
                desc: 'Create branded invoices with line items, taxes, and discounts in under 90 seconds.',
              },
              {
                icon: CreditCard,
                title: 'Payment Tracking',
                desc: 'Record full or partial payments. Invoice status updates automatically.',
              },
              {
                icon: BarChart3,
                title: 'Revenue Dashboard',
                desc: 'Real-time KPIs and monthly revenue charts so you always know where you stand.',
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white border border-[var(--paymint-surface-border)] rounded-xl p-6">
                <div className="w-10 h-10 rounded-lg bg-[var(--paymint-primary-50)] flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-[var(--paymint-primary-600)]" />
                </div>
                <h3 className="text-base font-semibold text-[var(--paymint-text-primary)] mb-2">{title}</h3>
                <p className="text-sm text-[var(--paymint-text-secondary)] leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 grid md:grid-cols-3 gap-4">
            {[
              'Auto-generated receipts when invoices are paid',
              'PDF export for invoices and receipts',
              'Client management with invoice history',
            ].map((item) => (
              <div key={item} className="flex items-start gap-3">
                <CheckCircle className="w-4 h-4 text-[var(--paymint-primary-600)] mt-0.5 flex-shrink-0" />
                <p className="text-sm text-[var(--paymint-text-secondary)]">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-white border-t border-[var(--paymint-surface-border)]">
        <div className="max-w-[560px] mx-auto text-center px-6">
          <h2 className="text-3xl font-semibold text-[var(--paymint-text-primary)] tracking-tight mb-4">
            Ready to get paid faster?
          </h2>
          <p className="text-base text-[var(--paymint-text-secondary)] mb-8">
            Join thousands of freelancers who trust PayMint for their invoicing.
          </p>
          <Link
            to="/signup"
            className="inline-flex items-center h-9 px-4 text-sm font-semibold text-white bg-[var(--paymint-primary-600)] rounded-full hover:bg-[var(--paymint-primary-500)] transition-colors"
          >
            Start free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="h-16 border-t border-[var(--paymint-surface-border)] flex items-center justify-between px-6 lg:px-10">
        <Logo size="sm" />
        <p className="text-xs text-[var(--paymint-text-tertiary)]">
          © {new Date().getFullYear()} PayMint · Privacy · Terms
        </p>
      </footer>
    </div>
  );
}
