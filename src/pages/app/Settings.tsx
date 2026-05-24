import { useState, type FormEvent } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Textarea from '../../components/ui/Textarea';
import Select from '../../components/ui/Select';
import { toast } from 'sonner';

export default function Settings() {
  const { profile, refreshProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'account'>('profile');

  // Profile form
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [businessName, setBusinessName] = useState(profile?.business_name || '');
  const [businessAddress, setBusinessAddress] = useState(profile?.business_address || '');
  const [businessEmail, setBusinessEmail] = useState(profile?.business_email || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [taxId, setTaxId] = useState(profile?.tax_id || '');
  const [currency, setCurrency] = useState(profile?.currency || 'USD');
  const [invoicePrefix, setInvoicePrefix] = useState(profile?.invoice_prefix || 'INV');
  const [defaultTaxRate, setDefaultTaxRate] = useState(String(profile?.default_tax_rate || 0));
  const [defaultPaymentTerms, setDefaultPaymentTerms] = useState(profile?.default_payment_terms || 'Net 30');
  const [profileSaving, setProfileSaving] = useState(false);

  // Account form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwdSaving, setPwdSaving] = useState(false);
  const [pwdError, setPwdError] = useState('');

  async function handleProfileSave(e: FormEvent) {
    e.preventDefault();
    if (!profile) return;
    setProfileSaving(true);
    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: fullName,
        business_name: businessName,
        business_address: businessAddress,
        business_email: businessEmail,
        phone,
        tax_id: taxId,
        currency,
        invoice_prefix: invoicePrefix,
        default_tax_rate: parseFloat(defaultTaxRate) || 0,
        default_payment_terms: defaultPaymentTerms,
      })
      .eq('id', profile.id);
    setProfileSaving(false);
    if (error) toast.error('Failed to save settings');
    else {
      await refreshProfile();
      toast.success('Settings saved');
    }
  }

  async function handlePasswordChange(e: FormEvent) {
    e.preventDefault();
    setPwdError('');
    if (newPassword.length < 6) {
      setPwdError('Password must be at least 6 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwdError('Passwords do not match');
      return;
    }
    setPwdSaving(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setPwdSaving(false);
    if (error) setPwdError(error.message);
    else {
      toast.success('Password updated');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-[var(--paymint-text-primary)] tracking-tight">Settings</h1>
        <p className="text-sm text-[var(--paymint-text-tertiary)] mt-0.5">Manage your business profile and account.</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-[var(--paymint-surface-border)] mb-6 flex gap-6">
        {(['profile', 'account'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`text-sm font-medium pb-3 border-b-2 capitalize transition-colors ${
              activeTab === tab
                ? 'text-[var(--paymint-primary-600)] border-[var(--paymint-primary-600)]'
                : 'text-[var(--paymint-text-secondary)] border-transparent hover:text-[var(--paymint-text-primary)]'
            }`}
          >
            {tab === 'profile' ? 'Business Profile' : 'Account'}
          </button>
        ))}
      </div>

      {activeTab === 'profile' && (
        <form onSubmit={handleProfileSave} className="max-w-[640px]">
          <div className="bg-white border border-[var(--paymint-surface-border)] rounded-xl p-6 shadow-sm space-y-5">
            <h2 className="text-sm font-semibold text-[var(--paymint-text-primary)]">Personal Info</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <Input
                label="Full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
              <Input
                label="Business name"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
              />
            </div>
            <Textarea
              label="Business address"
              value={businessAddress}
              onChange={(e) => setBusinessAddress(e.target.value)}
              placeholder="123 Main St, New York, NY 10001"
              className="min-h-[72px]"
            />
            <div className="grid sm:grid-cols-2 gap-4">
              <Input
                label="Business email"
                type="email"
                value={businessEmail}
                onChange={(e) => setBusinessEmail(e.target.value)}
              />
              <Input
                label="Phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <Input
              label="Tax ID / VAT number"
              value={taxId}
              onChange={(e) => setTaxId(e.target.value)}
              placeholder="Optional"
            />

            <div className="border-t border-[var(--paymint-surface-divider)] pt-5">
              <h2 className="text-sm font-semibold text-[var(--paymint-text-primary)] mb-4">Invoice Defaults</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <Input
                  label="Invoice number prefix"
                  value={invoicePrefix}
                  onChange={(e) => setInvoicePrefix(e.target.value)}
                  placeholder="INV"
                />
                <Select
                  label="Currency"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                >
                  <option value="USD">USD — US Dollar</option>
                  <option value="EUR">EUR — Euro</option>
                  <option value="GBP">GBP — British Pound</option>
                  <option value="CAD">CAD — Canadian Dollar</option>
                  <option value="AUD">AUD — Australian Dollar</option>
                  <option value="JPY">JPY — Japanese Yen</option>
                  <option value="SGD">SGD — Singapore Dollar</option>
                </Select>
                <Input
                  label="Default tax rate (%)"
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={defaultTaxRate}
                  onChange={(e) => setDefaultTaxRate(e.target.value)}
                />
                <Input
                  label="Default payment terms"
                  value={defaultPaymentTerms}
                  onChange={(e) => setDefaultPaymentTerms(e.target.value)}
                  placeholder="Net 30"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button type="submit" loading={profileSaving}>Save Settings</Button>
            </div>
          </div>
        </form>
      )}

      {activeTab === 'account' && (
        <form onSubmit={handlePasswordChange} className="max-w-[400px]">
          <div className="bg-white border border-[var(--paymint-surface-border)] rounded-xl p-6 shadow-sm space-y-4">
            <h2 className="text-sm font-semibold text-[var(--paymint-text-primary)]">Change Password</h2>
            <Input
              label="New password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              placeholder="Min. 6 characters"
            />
            <Input
              label="Confirm new password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Repeat new password"
            />
            {pwdError && (
              <p className="text-xs text-[var(--paymint-danger-text)]">{pwdError}</p>
            )}
            <div className="flex justify-end">
              <Button type="submit" loading={pwdSaving}>Update Password</Button>
            </div>
          </div>

          <div className="mt-4 bg-white border border-[var(--paymint-surface-border)] rounded-xl p-6 shadow-sm">
            <h2 className="text-sm font-semibold text-[var(--paymint-text-primary)] mb-1">Account Email</h2>
            <p className="text-sm text-[var(--paymint-text-secondary)] mb-0">
              {profile?.email}
            </p>
          </div>
        </form>
      )}
    </div>
  );
}
