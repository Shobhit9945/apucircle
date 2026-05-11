import { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import SectionHeader from '../../components/SectionHeader.jsx';
import { api, errorMessage } from '../../api/client.js';

const categories = ['Sports', 'Culture', 'Music', 'Arts', 'Academic', 'Community Service', 'Language', 'Technology', 'Entrepreneurship', 'Other'];

const fields = [
  { key: 'name', label: 'Club Name', placeholder: 'e.g., APU Peace Builders' },
  { key: 'meetingSchedule', label: 'Meeting Schedule', placeholder: 'e.g., Wednesdays 18:00 Room F204' },
  { key: 'contactEmail', label: 'Contact Email', placeholder: 'club@apu.ac.jp' },
  { key: 'instagramHandle', label: 'Instagram Handle', placeholder: '@clubname' },
  { key: 'bannerImage', label: 'Banner Image URL', placeholder: 'https://...' },
  { key: 'profileImage', label: 'Profile Image URL', placeholder: 'https://...' }
];

export default function StaffCreateClubPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', description: '', category: 'Sports', tags: '',
    languageOfOperation: 'Bilingual', meetingSchedule: '',
    bannerImage: '', profileImage: '', instagramHandle: '', contactEmail: ''
  });

  async function submit(event) {
    event.preventDefault();
    try {
      await api.post('/clubs', {
        ...form,
        tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
        bannerImage: form.bannerImage || undefined,
        profileImage: form.profileImage || undefined
      });
      toast.success('Club created');
      navigate('/staff/clubs');
    } catch (error) {
      toast.error(errorMessage(error, 'Could not create club'));
    }
  }

  const inputClass = 'w-full bg-surface-container-lowest border border-outline-variant text-on-surface rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-body-md';

  return (
    <section className="max-w-3xl">
      <SectionHeader title="Create Club" eyebrow="Staff" />
      <form onSubmit={submit} className="card p-6 space-y-5">
        <div className="grid gap-4 md:grid-cols-2">
          {fields.map(({ key, label, placeholder }) => (
            <div key={key} className="space-y-1">
              <label className="text-label-lg text-on-surface font-semibold">{label}</label>
              <input
                value={form[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                placeholder={placeholder}
                className={inputClass}
              />
            </div>
          ))}
          <div className="space-y-1">
            <label className="text-label-lg text-on-surface font-semibold">Category</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className={inputClass}
            >
              {categories.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-label-lg text-on-surface font-semibold">Language</label>
            <select
              value={form.languageOfOperation}
              onChange={(e) => setForm({ ...form, languageOfOperation: e.target.value })}
              className={inputClass}
            >
              <option>English</option>
              <option>Japanese</option>
              <option>Bilingual</option>
            </select>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-label-lg text-on-surface font-semibold">Tags</label>
          <input
            value={form.tags}
            onChange={(e) => setForm({ ...form, tags: e.target.value })}
            placeholder="Music, Performance, Culture (comma-separated)"
            className={inputClass}
          />
        </div>

        <div className="space-y-1">
          <label className="text-label-lg text-on-surface font-semibold">Description</label>
          <textarea
            required
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={5}
            placeholder="Describe the club's mission and activities..."
            className={`${inputClass} resize-none`}
          />
        </div>

        <div className="flex gap-3">
          <button className="bg-primary text-on-primary rounded-full px-6 py-3 text-label-lg font-semibold hover:bg-primary-container transition-colors flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            Create club
          </button>
          <button
            type="button"
            onClick={() => navigate('/staff/clubs')}
            className="border border-outline-variant text-on-surface px-6 py-3 rounded-full text-label-lg font-semibold hover:bg-surface-container-high transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </section>
  );
}
