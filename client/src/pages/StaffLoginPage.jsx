import { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { errorMessage } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function StaffLoginPage() {
  const { staffLogin } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [submitting, setSubmitting] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setSubmitting(true);
    try {
      await staffLogin(form);
      toast.success('Staff login successful');
      navigate('/staff/dashboard', { replace: true });
    } catch (error) {
      toast.error(errorMessage(error, 'Unable to log in'));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-inverse-surface px-4 py-12 font-sans">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <span
            className="material-symbols-outlined text-primary-fixed text-[48px] mb-4 block"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            trip_origin
          </span>
          <h1 className="text-headline-lg font-bold text-inverse-on-surface">APUCircle</h1>
          <p className="text-body-md text-inverse-on-surface/70 mt-1">University Staff Portal</p>
        </div>

        <form onSubmit={submit} className="bg-surface-container-lowest rounded-2xl p-6 shadow-soft space-y-4">
          <h2 className="text-headline-sm font-bold text-on-surface">Staff Sign In</h2>
          <div className="space-y-1">
            <label className="text-label-lg text-on-surface font-semibold">Email</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full bg-surface-container-low border border-outline-variant text-on-surface rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-body-md"
              placeholder="staff@apu.ac.jp"
            />
          </div>
          <div className="space-y-1">
            <label className="text-label-lg text-on-surface font-semibold">Password</label>
            <input
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full bg-surface-container-low border border-outline-variant text-on-surface rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-body-md"
              placeholder="••••••••"
            />
          </div>
          <button
            disabled={submitting}
            className="w-full bg-primary text-on-primary rounded-full py-3 text-label-lg font-semibold hover:bg-primary-container transition-colors disabled:opacity-60 mt-2"
          >
            {submitting ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </main>
  );
}
