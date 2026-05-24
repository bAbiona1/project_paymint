import { forwardRef, type SelectHTMLAttributes } from 'react';
import { cn } from '../../lib/utils';
import { ChevronDown } from 'lucide-react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  required?: boolean;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, required, id, children, ...props }, ref) => {
    return (
      <div className="flex flex-col">
        {label && (
          <label
            htmlFor={id}
            className="text-sm font-medium text-[var(--paymint-text-secondary)] mb-1.5 text-left"
          >
            {label}
            {required && <span className="text-[var(--paymint-danger-text)] ml-0.5">*</span>}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={id}
            className={cn(
              'h-10 w-full rounded-md border px-3 pr-8 text-sm text-[var(--paymint-text-primary)] bg-white appearance-none',
              'transition-colors duration-[120ms]',
              'focus:outline-none focus:ring-2 focus:ring-[var(--paymint-primary-100)] focus:border-[var(--paymint-primary-600)]',
              'disabled:bg-[var(--paymint-surface-subtle)] disabled:cursor-not-allowed',
              error
                ? 'border-[var(--paymint-danger-border)]'
                : 'border-[var(--paymint-surface-border)] hover:border-[var(--paymint-primary-300)]',
              className
            )}
            {...props}
          >
            {children}
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--paymint-text-tertiary)] pointer-events-none" />
        </div>
        {error && <p className="mt-1 text-xs text-[var(--paymint-danger-text)]">{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';
export default Select;
