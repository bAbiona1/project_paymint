import { forwardRef, type TextareaHTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, hint, id, ...props }, ref) => {
    return (
      <div className="flex flex-col">
        {label && (
          <label
            htmlFor={id}
            className="text-sm font-medium text-[var(--paymint-text-secondary)] mb-1.5 text-left"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={id}
          className={cn(
            'min-h-[80px] rounded-md border px-3 py-2 text-sm text-[var(--paymint-text-primary)] bg-white resize-y',
            'placeholder:text-[var(--paymint-text-disabled)]',
            'transition-colors duration-[120ms]',
            'focus:outline-none focus:ring-2 focus:ring-[var(--paymint-primary-100)] focus:border-[var(--paymint-primary-600)]',
            error
              ? 'border-[var(--paymint-danger-border)]'
              : 'border-[var(--paymint-surface-border)] hover:border-[var(--paymint-primary-300)]',
            className
          )}
          {...props}
        />
        {error && <p className="mt-1 text-xs text-[var(--paymint-danger-text)]">{error}</p>}
        {hint && !error && <p className="mt-1 text-xs text-[var(--paymint-text-tertiary)]">{hint}</p>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
export default Textarea;
