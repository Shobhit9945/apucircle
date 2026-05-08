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
    <main className="grid min-h-screen place-items-center bg-navy px-4 py-12">
      <form onSubmit={submit} className="w-full max-w-md border-t-4 border-apu-crimson bg-white p-6">
        <p className="apu-kicker">University staff</p>
        <h1 className="font-heading text-3xl font-semibold text-navy">Staff login</h1>
        <div className="mt-6 grid gap-4">
          <label className="grid gap-1 text-sm font-semibold text-slate-700">
            Email
            <input type="email" required value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} className="focus-ring rounded-lg border border-slate-200 px-3 py-2" />
          </label>
          <label className="grid gap-1 text-sm font-semibold text-slate-700">
            Password
            <input type="password" required value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} className="focus-ring rounded-lg border border-slate-200 px-3 py-2" />
          </label>
          <button disabled={submitting} className="focus-ring bg-black px-4 py-3 font-bold text-white hover:bg-apu-crimson disabled:opacity-60">
            {submitting ? 'Logging in...' : 'Login'}
          </button>
        </div>
      </form>
    </main>
  );
}
