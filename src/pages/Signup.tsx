import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Logo from '../components/Logo';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

export default function Signup() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    const { error } = await signUp(email, password, fullName, businessName);
    setLoading(false);
    if (error) {
      setError(error.message || 'Something went wrong. Please try again.');
    } else {
      navigate('/app/dashboard');
    }
  }

  return (
    <div className="min-h-screen bg-[var(--paymint-surface-bg)] flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-[400px]">
        <div className="flex justify-center mb-8">
          <Logo size="md" />
        </div>

        <div className="bg-white border border-[var(--paymint-surface-border)] rounded-xl p-8 shadow-sm">
          <h1 className="text-xl font-semibold text-[var(--paymint-text-primary)] mb-1 text-left">Create your account</h1>
          <p className="text-sm text-[var(--paymint-text-tertiary)] mb-6 text-left">Start invoicing in under 2 minutes.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              id="fullName"
              label="Full name"
              type="text"
              placeholder="Marcus Chen"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              autoComplete="name"
            />
            <Input
              id="businessName"
              label="Business name"
              type="text"
              placeholder="Chen Consulting"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              autoComplete="organization"
            />
            <Input
              id="email"
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
            <Input
              id="password"
              label="Password"
              type="password"
              placeholder="Min. 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
              hint="At least 6 characters"
            />

            {error && (
              <div className="text-sm text-[var(--paymint-danger-text)] bg-[var(--paymint-danger-bg)] border border-[var(--paymint-danger-border)] rounded-md px-3 py-2">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" loading={loading}>
              Create account
            </Button>
          </form>

          <p className="mt-6 text-sm text-center text-[var(--paymint-text-tertiary)]">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-[var(--paymint-primary-600)] hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
