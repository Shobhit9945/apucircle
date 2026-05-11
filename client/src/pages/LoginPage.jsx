import { useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { errorMessage } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [submitting, setSubmitting] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setSubmitting(true);
    try {
      const user = await login(form);
      toast.success('Welcome back');
      navigate(location.state?.from?.pathname || (user.role === 'staff' ? '/staff/dashboard' : '/dashboard'), { replace: true });
    } catch (error) {
      toast.error(errorMessage(error, 'Unable to log in'));
    } finally {
      setSubmitting(false);
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
