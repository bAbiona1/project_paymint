import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type InvoiceStatus = 'draft' | 'sent' | 'partially_paid' | 'paid' | 'overdue' | 'cancelled';

export interface Profile {
  id: string;
  created_at: string;
  updated_at: string;
  email: string;
  full_name: string | null;
  business_name: string | null;
  business_address: string | null;
  business_email: string | null;
  tax_id: string | null;
  phone: string | null;
  logo_url: string | null;
  currency: string;
  invoice_prefix: string;
  next_invoice_number: number;
  default_tax_rate: number;
  default_payment_terms: string;
}

export interface Client {
  id: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  address: string | null;
  city: string | null;
  country: string | null;
  notes: string | null;
  is_archived: boolean;
}

export interface Invoice {
  id: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  client_id: string;
  invoice_number: string;
  issue_date: string;
  due_date: string | null;
  status: InvoiceStatus;
  subtotal: number;
  tax_total: number;
  discount_type: 'flat' | 'percent' | null;
  discount_value: number;
  discount_amount: number;
  total: number;
  amount_paid: number;
  balance_due: number;
  notes: string | null;
  payment_terms: string | null;
  sent_at: string | null;
  paid_at: string | null;
  client?: Client;
}

export interface InvoiceItem {
  id: string;
  created_at: string;
  invoice_id: string;
  user_id: string;
  description: string;
  quantity: number;
  unit_price: number;
  tax_rate: number;
  tax_amount: number;
  line_total: number;
  sort_order: number;
}

export interface Payment {
  id: string;
  created_at: string;
  invoice_id: string;
  user_id: string;
  amount: number;
  payment_date: string;
  payment_method: string | null;
  notes: string | null;
}

export interface Receipt {
  id: string;
  created_at: string;
  invoice_id: string;
  user_id: string;
  receipt_number: string;
  issued_at: string;
  total_paid: number;
  notes: string | null;
  invoice?: Invoice;
}
