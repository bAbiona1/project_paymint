import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { InvoiceStatus } from './supabase';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return '—';
  const date = new Date(dateStr + (dateStr.includes('T') ? '' : 'T00:00:00'));
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

export function formatDateShort(dateStr: string | null | undefined): string {
  if (!dateStr) return '—';
  const date = new Date(dateStr + (dateStr.includes('T') ? '' : 'T00:00:00'));
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
  }).format(date);
}

export function getStatusConfig(status: InvoiceStatus) {
  switch (status) {
    case 'paid':
      return {
        label: 'Paid',
        bg: 'var(--paymint-success-bg)',
        text: 'var(--paymint-success-text)',
        border: 'var(--paymint-success-border)',
        dot: '#1a6b45',
      };
    case 'sent':
      return {
        label: 'Sent',
        bg: 'var(--paymint-info-bg)',
        text: 'var(--paymint-info-text)',
        border: 'var(--paymint-info-border)',
        dot: '#1e4d8c',
      };
    case 'partially_paid':
      return {
        label: 'Partial',
        bg: 'var(--paymint-warning-bg)',
        text: 'var(--paymint-warning-text)',
        border: 'var(--paymint-warning-border)',
        dot: '#7a5a0d',
      };
    case 'overdue':
      return {
        label: 'Overdue',
        bg: 'var(--paymint-danger-bg)',
        text: 'var(--paymint-danger-text)',
        border: 'var(--paymint-danger-border)',
        dot: '#8b1a1a',
      };
    case 'cancelled':
      return {
        label: 'Cancelled',
        bg: 'var(--paymint-neutral-bg)',
        text: 'var(--paymint-neutral-text)',
        border: 'var(--paymint-neutral-border)',
        dot: '#5a6473',
      };
    default:
      return {
        label: 'Draft',
        bg: 'var(--paymint-neutral-bg)',
        text: 'var(--paymint-neutral-text)',
        border: 'var(--paymint-neutral-border)',
        dot: '#5a6473',
      };
  }
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function generateReceiptNumber(sequence: number): string {
  const year = new Date().getFullYear();
  return `REC-${year}-${String(sequence).padStart(4, '0')}`;
}

export function isOverdue(invoice: { due_date: string | null; status: InvoiceStatus }): boolean {
  if (!invoice.due_date) return false;
  if (['paid', 'cancelled', 'draft'].includes(invoice.status)) return false;
  return new Date(invoice.due_date) < new Date(new Date().toDateString());
}
