import { useState } from 'react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { errorMessage } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';

const interests = [
  'Music',
  'Sailing',
  'Debate',
  'Entrepreneurship',
  'Community Service',
  'Language Exchange',
  'Technology',
  'Dance',
  'Sports',
  'Culture',
  'Photography',
  'Public Speaking'
];

export default function RegisterPage() {
  const { register } = useAuth();
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    languageBasis: 'English',
    semester: 1,
    interests: []
  });
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  function toggleInterest(interest) {
    const selected = new Set(form.interests);
    selected.has(interest) ? selected.delete(interest) : selected.add(interest);
    setForm({ ...form, interests: Array.from(selected) });
  }

  async function submit(event) {
    event.preventDefault();
    setSubmitting(true);
    try {
      await register(form);
      setSent(true);
      toast.success('Verification email prepared');
    } catch (error) {
      toast.error(errorMessage(error, 'Registration failed'));
    } finally {
      setSubmitting(false);
    }
  }

  if (sent) {
    return (
      <main className="grid min-h-[calc(100vh-65px)] place-items-center px-4 py-12">
        <section className="card max-w-lg space-y-4 p-6 text-center">
          <h1 className="font-heading text-3xl font-semibold text-navy">Check your verification link</h1>
          <p className="text-slate-600">
            In local development without SMTP credentials, the backend prints the verification URL in the server console.
          </p>
          <Link to="/login" className="inline-flex rounded-lg bg-navy px-4 py-3 font-bold text-white">
            Go to login
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="px-4 py-10">
      <form onSubmit={submit} className="card mx-auto max-w-3xl space-y-6 p-6">
        <div>
          <p className="apu-kicker">Join year-round</p>
          <h1 className="font-heading text-3xl font-semibold text-navy">Create your student account</h1>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-1 text-sm font-semibold text-slate-700">
            Full name
            <input required value={form.fullName} onChange={(event) => setForm({ ...form, fullName: event.target.value })} className="focus-ring rounded-lg border border-slate-200 px-3 py-2" />
          </label>
          <label className="grid gap-1 text-sm font-semibold text-slate-700">
            APU email
            <input required type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} className="focus-ring rounded-lg border border-slate-200 px-3 py-2" placeholder="name@apu.ac.jp" />
          </label>
          <label className="grid gap-1 text-sm font-semibold text-slate-700">
            Password
            <input required type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} className="focus-ring rounded-lg border border-slate-200 px-3 py-2" />
          </label>
          <label className="grid gap-1 text-sm font-semibold text-slate-700">
            Semester
            <input required type="number" min="1" max="12" value={form.semester} onChange={(event) => setForm({ ...form, semester: Number(event.target.value) })} className="focus-ring rounded-lg border border-slate-200 px-3 py-2" />
          </label>
          <label className="grid gap-1 text-sm font-semibold text-slate-700">
            Language basis
            <select value={form.languageBasis} onChange={(event) => setForm({ ...form, languageBasis: event.target.value })} className="focus-ring rounded-lg border border-slate-200 px-3 py-2">
              <option>English</option>
              <option>Japanese</option>
            </select>
          </label>
        </div>
        <div>
          <h2 className="font-heading text-lg font-semibold text-navy">Interests</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {interests.map((interest) => {
              const active = form.interests.includes(interest);
              return (
                <button
                  type="button"
                  key={interest}
                  onClick={() => toggleInterest(interest)}
                  className={`rounded-full px-3 py-2 text-sm font-semibold ring-1 ${
                    active ? 'bg-apu-crimson text-white ring-apu-crimson' : 'bg-white text-slate-600 ring-line hover:ring-apu-crimson'
                  }`}
                >
                  {interest}
                </button>
              );
            })}
          </div>
        </div>
        <button disabled={submitting} className="focus-ring bg-apu-crimson px-5 py-3 font-bold text-white hover:bg-crimson-dark disabled:opacity-60">
          {submitting ? 'Creating account...' : 'Create account'}
        </button>
      </form>
    </main>
  );
}
