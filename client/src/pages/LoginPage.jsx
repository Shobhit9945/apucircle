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
    <main className="grid min-h-[calc(100vh-65px)] place-items-center px-4 py-12">
      <form onSubmit={submit} className="card w-full max-w-md space-y-5 p-6">
        <div>
          <p className="apu-kicker">Student portal</p>
          <h1 className="font-heading text-3xl font-semibold text-navy">Log in to APUCircle</h1>
        </div>
        <label className="grid gap-1 text-sm font-semibold text-slate-700">
          APU email
          <input
            type="email"
            required
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
            className="focus-ring rounded-lg border border-slate-200 px-3 py-2"
          />
        </label>
        <label className="grid gap-1 text-sm font-semibold text-slate-700">
          Password
          <input
            type="password"
            required
            value={form.password}
            onChange={(event) => setForm({ ...form, password: event.target.value })}
            className="focus-ring rounded-lg border border-slate-200 px-3 py-2"
          />
        </label>
        <button disabled={submitting} className="focus-ring w-full bg-black px-4 py-3 font-bold text-white hover:bg-apu-crimson disabled:opacity-60">
          {submitting ? 'Logging in...' : 'Login'}
        </button>
        <p className="text-center text-sm text-slate-600">
          New to APUCircle?{' '}
          <Link to="/register" className="font-bold text-apu-crimson">
            Create an account
          </Link>
        </p>
      </form>
    </main>
  );
}
