import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Logo from '../components/Logo';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

export default function Login() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);
    if (error) {
      setError(error.message || 'Invalid email or password');
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
          <h1 className="text-xl font-semibold text-[var(--paymint-text-primary)] mb-1 text-left">Welcome back</h1>
          <p className="text-sm text-[var(--paymint-text-tertiary)] mb-6 text-left">Sign in to your account to continue.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
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
            <div>
              <Input
                id="password"
                label="Password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
              <div className="mt-1.5 text-right">
                <Link
                  to="/forgot-password"
                  className="text-xs text-[var(--paymint-text-tertiary)] hover:text-[var(--paymint-primary-600)] transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            {error && (
              <div className="text-sm text-[var(--paymint-danger-text)] bg-[var(--paymint-danger-bg)] border border-[var(--paymint-danger-border)] rounded-md px-3 py-2">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" loading={loading}>
              Sign in
            </Button>
          </form>

          <p className="mt-6 text-sm text-center text-[var(--paymint-text-tertiary)]">
            Don't have an account?{' '}
            <Link to="/signup" className="font-medium text-[var(--paymint-primary-600)] hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
