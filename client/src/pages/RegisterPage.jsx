import { useState } from 'react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { errorMessage } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';

const interests = [
  'Music', 'Sailing', 'Debate', 'Entrepreneurship', 'Community Service',
  'Language Exchange', 'Technology', 'Dance', 'Sports', 'Culture',
  'Photography', 'Public Speaking'
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
      <main className="min-h-[calc(100vh-73px)] flex items-center justify-center px-4 py-12 bg-background">
        <div className="card max-w-lg w-full p-8 text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-tertiary-fixed flex items-center justify-center mx-auto">
            <span className="material-symbols-outlined text-tertiary text-[28px]">mark_email_read</span>
          </div>
          <h1 className="text-headline-md font-bold text-on-surface">Check your email</h1>
          <p className="text-body-md text-on-surface-variant">
            In local development without SMTP credentials, the backend prints the verification URL in the server console.
          </p>
          <Link to="/login" className="inline-flex bg-primary text-on-primary px-6 py-3 rounded-full text-label-lg font-semibold hover:bg-primary-container transition-colors">
            Go to login
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="px-4 py-10 bg-background min-h-[calc(100vh-73px)]">
      <div className="mx-auto max-w-3xl">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center text-on-primary font-bold text-xl mx-auto mb-4">
            A
          </div>
          <h1 className="text-headline-lg font-bold text-on-surface">Create your account</h1>
          <p className="text-body-md text-on-surface-variant mt-1">Join APUCircle and find your community.</p>
        </div>

        <form onSubmit={submit} className="card p-6 space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { label: 'Full name', key: 'fullName', type: 'text', placeholder: 'Your name' },
              { label: 'APU email', key: 'email', type: 'email', placeholder: 'name@apu.ac.jp' },
              { label: 'Password', key: 'password', type: 'password', placeholder: '••••••••' }
            ].map(({ label, key, type, placeholder }) => (
              <div key={key} className="space-y-1">
                <label className="text-label-lg text-on-surface font-semibold">{label}</label>
                <input
                  required
                  type={type}
                  value={form[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  placeholder={placeholder}
                  className="w-full bg-surface-container-lowest border border-outline-variant text-on-surface rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-body-md"
                />
              </div>
            ))}
            <div className="space-y-1">
              <label className="text-label-lg text-on-surface font-semibold">Semester</label>
              <input
                required
                type="number"
                min="1"
                max="12"
                value={form.semester}
                onChange={(e) => setForm({ ...form, semester: Number(e.target.value) })}
                className="w-full bg-surface-container-lowest border border-outline-variant text-on-surface rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-body-md"
              />
            </div>
            <div className="space-y-1">
              <label className="text-label-lg text-on-surface font-semibold">Language basis</label>
              <select
                value={form.languageBasis}
                onChange={(e) => setForm({ ...form, languageBasis: e.target.value })}
                className="w-full bg-surface-container-lowest border border-outline-variant text-on-surface rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-body-md"
              >
                <option>English</option>
                <option>Japanese</option>
              </select>
            </div>
          </div>

          <div>
            <h2 className="text-label-lg text-on-surface font-semibold mb-3">Interests</h2>
            <div className="flex flex-wrap gap-2">
              {interests.map((interest) => {
                const active = form.interests.includes(interest);
                return (
                  <button
                    type="button"
                    key={interest}
                    onClick={() => toggleInterest(interest)}
                    className={`px-4 py-2 rounded-full text-label-md transition-colors ${
                      active
                        ? 'bg-primary text-on-primary shadow-sm'
                        : 'bg-surface-container-lowest border border-outline-variant text-on-surface hover:bg-surface-container-low'
                    }`}
                  >
                    {interest}
                  </button>
                );
              })}
            </div>
          </div>

          <button
            disabled={submitting}
            className="w-full bg-primary text-on-primary rounded-full py-3 text-label-lg font-semibold hover:bg-primary-container transition-colors disabled:opacity-60"
          >
            {submitting ? 'Creating account...' : 'Create account'}
          </button>

          <p className="text-center text-body-sm text-on-surface-variant">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}
