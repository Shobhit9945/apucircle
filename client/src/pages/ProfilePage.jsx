import { useState } from 'react';
import toast from 'react-hot-toast';
import SectionHeader from '../components/SectionHeader.jsx';
import { api, errorMessage } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';

const interests = [
  'Music', 'Sailing', 'Debate', 'Entrepreneurship', 'Community Service',
  'Language Exchange', 'Technology', 'Dance', 'Sports', 'Culture',
  'Photography', 'Public Speaking', 'Programming', 'Startups'
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

  const initials = user?.fullName
    ? user.fullName.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
    : 'U';

  return (
    <section className="space-y-6 max-w-3xl">
      {/* Profile Header */}
      <div className="card p-6 flex items-center gap-5">
        <div className="w-16 h-16 rounded-full bg-primary text-on-primary flex items-center justify-center text-headline-md font-bold flex-shrink-0">
          {initials}
        </div>
        <div>
          <h1 className="text-headline-sm font-bold text-on-surface">{user?.fullName}</h1>
          <p className="text-body-sm text-on-surface-variant">{user?.email}</p>
          <span className="inline-flex items-center gap-1 mt-1 bg-primary-fixed text-primary px-3 py-0.5 rounded-full text-label-md">
            <span className="material-symbols-outlined text-[14px]">school</span>
            Semester {user?.semester}
          </span>
        </div>
      </div>

      <SectionHeader title="Edit Profile" eyebrow="Preferences" />

      <form onSubmit={submit} className="card p-6 space-y-5">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-1">
            <label className="text-label-lg text-on-surface font-semibold">Full name</label>
            <input
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              className="w-full bg-surface-container-lowest border border-outline-variant text-on-surface rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-body-md"
            />
          </div>
          <div className="space-y-1">
            <label className="text-label-lg text-on-surface font-semibold">Semester</label>
            <input
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
              className="w-full bg-surface-container-lowest border border-outline-variant text-on-surface rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-all text-body-md"
            >
              <option>English</option>
              <option>Japanese</option>
            </select>
          </div>
        </div>

        <div>
          <p className="text-label-lg text-on-surface font-semibold mb-3">Interests</p>
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

        <button className="bg-primary text-on-primary rounded-full px-6 py-3 text-label-lg font-semibold hover:bg-primary-container transition-colors">
          Save changes
        </button>
      </form>

      <form onSubmit={changePassword} className="card p-6 space-y-4">
        <h2 className="text-headline-sm font-bold text-on-surface">Change password</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <label className="text-label-lg text-on-surface font-semibold">Current password</label>
            <input
              type="password"
              required
              value={passwordForm.currentPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
              className="w-full bg-surface-container-lowest border border-outline-variant text-on-surface rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-body-md"
            />
          </div>
          <div className="space-y-1">
            <label className="text-label-lg text-on-surface font-semibold">New password</label>
            <input
              type="password"
              required
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
              className="w-full bg-surface-container-lowest border border-outline-variant text-on-surface rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-body-md"
            />
          </div>
        </div>
        <button className="bg-primary text-on-primary rounded-full px-6 py-3 text-label-lg font-semibold hover:bg-primary-container transition-colors">
          Update password
        </button>
      </form>
    </section>
  );
}
