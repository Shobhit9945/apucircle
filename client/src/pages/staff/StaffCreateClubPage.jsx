import { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import SectionHeader from '../../components/SectionHeader.jsx';
import { api, errorMessage } from '../../api/client.js';

const categories = ['Sports', 'Culture', 'Music', 'Arts', 'Academic', 'Community Service', 'Language', 'Technology', 'Entrepreneurship', 'Other'];

export default function StaffCreateClubPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    description: '',
    category: 'Sports',
    tags: '',
    languageOfOperation: 'Bilingual',
    meetingSchedule: '',
    bannerImage: '',
    profileImage: '',
    instagramHandle: '',
    contactEmail: ''
  });

  async function submit(event) {
    event.preventDefault();
    try {
      await api.post('/clubs', {
        ...form,
        tags: form.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
        bannerImage: form.bannerImage || undefined,
        profileImage: form.profileImage || undefined
      });
      toast.success('Club created');
      navigate('/staff/clubs');
    } catch (error) {
      toast.error(errorMessage(error, 'Could not create club'));
    }
  }

  return (
    <section>
      <SectionHeader title="Create club" eyebrow="Staff" />
      <form onSubmit={submit} className="card grid gap-4 p-5">
        <div className="grid gap-4 md:grid-cols-2">
          {['name', 'meetingSchedule', 'contactEmail', 'instagramHandle', 'bannerImage', 'profileImage'].map((field) => (
            <label key={field} className="grid gap-1 text-sm font-semibold text-slate-700">
              {field}
              <input value={form[field]} onChange={(event) => setForm({ ...form, [field]: event.target.value })} className="focus-ring rounded-lg border border-slate-200 px-3 py-2" />
            </label>
          ))}
          <label className="grid gap-1 text-sm font-semibold text-slate-700">
            Category
            <select value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} className="focus-ring rounded-lg border border-slate-200 px-3 py-2">
              {categories.map((category) => <option key={category}>{category}</option>)}
            </select>
          </label>
          <label className="grid gap-1 text-sm font-semibold text-slate-700">
            Language
            <select value={form.languageOfOperation} onChange={(event) => setForm({ ...form, languageOfOperation: event.target.value })} className="focus-ring rounded-lg border border-slate-200 px-3 py-2">
              <option>English</option>
              <option>Japanese</option>
              <option>Bilingual</option>
            </select>
          </label>
        </div>
        <label className="grid gap-1 text-sm font-semibold text-slate-700">
          Tags
          <input value={form.tags} onChange={(event) => setForm({ ...form, tags: event.target.value })} className="focus-ring rounded-lg border border-slate-200 px-3 py-2" placeholder="Music, Performance, Culture" />
        </label>
        <label className="grid gap-1 text-sm font-semibold text-slate-700">
          Description
          <textarea required value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} rows={6} className="focus-ring rounded-lg border border-slate-200 px-3 py-2" />
        </label>
        <button className="w-fit bg-apu-crimson px-5 py-3 font-bold text-white hover:bg-crimson-dark">Create club</button>
      </form>
    </section>
  );
}
