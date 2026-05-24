import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../lib/utils';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive';
  size?: 'sm' | 'default' | 'lg';
  loading?: boolean;
  icon?: ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'default', loading, icon, children, disabled, ...props }, ref) => {
    const base = 'inline-flex items-center justify-center gap-2 font-semibold rounded-md transition-all duration-[120ms] ease-out focus-visible:outline-none disabled:opacity-50 disabled:cursor-not-allowed select-none';

    const variants = {
      primary: 'bg-[var(--paymint-primary-600)] text-white hover:bg-[var(--paymint-primary-500)] active:bg-[var(--paymint-primary-700)]',
      secondary: 'bg-white border border-[var(--paymint-surface-border)] text-[var(--paymint-text-primary)] hover:bg-[var(--paymint-surface-subtle)] hover:border-[var(--paymint-primary-300)]',
      ghost: 'text-[var(--paymint-text-secondary)] hover:bg-[var(--paymint-surface-subtle)]',
      destructive: 'bg-[var(--paymint-danger-bg)] text-[var(--paymint-danger-text)] border border-[var(--paymint-danger-border)] hover:opacity-90',
    };

    const sizes = {
      sm: 'h-8 px-3 text-xs',
      default: 'h-10 px-4 text-sm',
      lg: 'h-11 px-6 text-sm',
    };

    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], sizes[size], className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : icon}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
export default Button;
