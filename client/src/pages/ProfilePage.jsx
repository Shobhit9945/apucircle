import { useState } from 'react';
import toast from 'react-hot-toast';
import SectionHeader from '../components/SectionHeader.jsx';
import { api, errorMessage } from '../api/client.js';
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
  'Public Speaking',
  'Programming',
  'Startups'
];

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const [form, setForm] = useState({
    fullName: user?.fullName || '',
    semester: user?.semester || 1,
    languageBasis: user?.languageBasis || 'English',
    interests: user?.interests || []
  });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '' });

  function toggleInterest(interest) {
    const selected = new Set(form.interests);
    selected.has(interest) ? selected.delete(interest) : selected.add(interest);
    setForm({ ...form, interests: Array.from(selected) });
  }

  async function submit(event) {
    event.preventDefault();
    try {
      await updateProfile(form);
      toast.success('Profile updated');
    } catch (error) {
      toast.error(errorMessage(error, 'Could not update profile'));
    }
  }

  async function changePassword(event) {
    event.preventDefault();
    try {
      await api.put('/users/me/password', passwordForm);
      toast.success('Password changed');
      setPasswordForm({ currentPassword: '', newPassword: '' });
    } catch (error) {
      toast.error(errorMessage(error, 'Could not change password'));
    }
  }

  return (
    <section>
      <SectionHeader title="Profile" eyebrow="Preferences" />
      <form onSubmit={submit} className="card grid gap-5 p-5">
        <div className="grid gap-4 md:grid-cols-3">
          <label className="grid gap-1 text-sm font-semibold text-slate-700">
            Full name
            <input value={form.fullName} onChange={(event) => setForm({ ...form, fullName: event.target.value })} className="focus-ring rounded-lg border border-slate-200 px-3 py-2" />
          </label>
          <label className="grid gap-1 text-sm font-semibold text-slate-700">
            Semester
            <input type="number" min="1" max="12" value={form.semester} onChange={(event) => setForm({ ...form, semester: Number(event.target.value) })} className="focus-ring rounded-lg border border-slate-200 px-3 py-2" />
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
        <button className="focus-ring w-fit bg-black px-5 py-3 font-bold text-white hover:bg-apu-crimson">Save changes</button>
      </form>
      <form onSubmit={changePassword} className="card mt-6 grid max-w-2xl gap-4 p-5">
        <h2 className="font-heading text-xl font-semibold text-navy">Change password</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-1 text-sm font-semibold text-slate-700">
            Current password
            <input type="password" required value={passwordForm.currentPassword} onChange={(event) => setPasswordForm({ ...passwordForm, currentPassword: event.target.value })} className="focus-ring rounded-lg border border-slate-200 px-3 py-2" />
          </label>
          <label className="grid gap-1 text-sm font-semibold text-slate-700">
            New password
            <input type="password" required value={passwordForm.newPassword} onChange={(event) => setPasswordForm({ ...passwordForm, newPassword: event.target.value })} className="focus-ring rounded-lg border border-slate-200 px-3 py-2" />
          </label>
        </div>
        <button className="focus-ring w-fit bg-apu-crimson px-5 py-3 font-bold text-white hover:bg-crimson-dark">Update password</button>
      </form>
    </section>
  );
}
