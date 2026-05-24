import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, required, id, ...props }, ref) => {
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
        <input
          ref={ref}
          id={id}
          className={cn(
            'h-10 rounded-md border px-3 text-sm text-[var(--paymint-text-primary)] bg-white',
            'placeholder:text-[var(--paymint-text-disabled)]',
            'transition-colors duration-[120ms]',
            'focus:outline-none focus:ring-2 focus:ring-[var(--paymint-primary-100)] focus:border-[var(--paymint-primary-600)]',
            'disabled:bg-[var(--paymint-surface-subtle)] disabled:text-[var(--paymint-text-disabled)] disabled:cursor-not-allowed',
            error
              ? 'border-[var(--paymint-danger-border)] focus:ring-[var(--paymint-danger-bg)]'
              : 'border-[var(--paymint-surface-border)] hover:border-[var(--paymint-primary-300)]',
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-1 text-xs text-[var(--paymint-danger-text)]">{error}</p>
        )}
        {hint && !error && (
          <p className="mt-1 text-xs text-[var(--paymint-text-tertiary)]">{hint}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
