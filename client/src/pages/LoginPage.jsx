import { useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { errorMessage } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function LoginPage() {
  const { login, resendVerification } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [submitting, setSubmitting] = useState(false);
  const [needsVerification, setNeedsVerification] = useState(false);
  const [resending, setResending] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setSubmitting(true);
    setNeedsVerification(false);
    try {
      const user = await login(form);
      toast.success('Welcome back');
      navigate(location.state?.from?.pathname || (user.role === 'staff' ? '/staff/dashboard' : '/dashboard'), { replace: true });
    } catch (error) {
      const message = errorMessage(error, 'Unable to log in');
      toast.error(message);
      if (error.response?.status === 403 && /verify your email/i.test(message)) {
        setNeedsVerification(true);
      }
    } finally {
      setSubmitting(false);
    }
  }

  async function handleResend() {
    if (!form.email) {
      toast.error('Enter your APU email above first');
      return;
    }
    setResending(true);
    try {
      const { message } = await resendVerification(form.email);
      toast.success(message || 'Verification email sent if the account is unverified');
    } catch (error) {
      toast.error(errorMessage(error, 'Could not resend verification email'));
    } finally {
      setResending(false);
    }
  }

  return (
    <main className="min-h-[calc(100vh-73px)] flex items-center justify-center px-4 py-12 bg-background">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center text-on-primary font-bold text-xl mx-auto mb-4">
            A
          </div>
          <h1 className="text-headline-lg font-bold text-on-surface">Welcome back</h1>
          <p className="text-body-md text-on-surface-variant mt-1">Sign in to APUCircle</p>
        </div>

        <form onSubmit={submit} className="card p-6 space-y-4">
          <div className="space-y-1">
            <label className="text-label-lg text-on-surface font-semibold">APU email</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full bg-surface-container-lowest border border-outline-variant text-on-surface rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-body-md"
              placeholder="name@apu.ac.jp"
            />
          </div>
          <div className="space-y-1">
            <label className="text-label-lg text-on-surface font-semibold">Password</label>
            <input
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full bg-surface-container-lowest border border-outline-variant text-on-surface rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-body-md"
              placeholder="••••••••"
            />
          </div>
          <button
            disabled={submitting}
            className="w-full bg-primary text-on-primary rounded-full py-3 text-label-lg font-semibold hover:bg-primary-container transition-colors disabled:opacity-60 mt-2"
          >
            {submitting ? 'Signing in...' : 'Sign in'}
          </button>
          {needsVerification && (
            <button
              type="button"
              onClick={handleResend}
              disabled={resending}
              className="w-full border border-primary text-primary rounded-full py-3 text-label-lg font-semibold hover:bg-primary/5 transition-colors disabled:opacity-60"
            >
              {resending ? 'Sending...' : 'Resend verification email'}
            </button>
          )}
          <p className="text-center text-body-sm text-on-surface-variant">
            New to APUCircle?{' '}
            <Link to="/register" className="text-primary font-semibold hover:underline">
              Create an account
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}
