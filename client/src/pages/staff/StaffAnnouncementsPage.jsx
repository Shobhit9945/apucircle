import { useState } from 'react';
import toast from 'react-hot-toast';
import SectionHeader from '../../components/SectionHeader.jsx';
import { api, errorMessage } from '../../api/client.js';

export default function StaffAnnouncementsPage() {
  const [form, setForm] = useState({ title: '', body: '' });

  async function submit(event) {
    event.preventDefault();
    try {
      await api.post('/staff/announcements', form);
      toast.success('Platform announcement sent');
      setForm({ title: '', body: '' });
    } catch (error) {
      toast.error(errorMessage(error, 'Could not send announcement'));
    }
  }

  return (
    <section>
      <SectionHeader title="Platform announcements" eyebrow="Staff broadcast" />
      <form onSubmit={submit} className="card grid max-w-3xl gap-4 p-5">
        <label className="grid gap-1 text-sm font-semibold text-slate-700">
          Title
          <input required maxLength={140} value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} className="focus-ring rounded-lg border border-slate-200 px-3 py-2" />
        </label>
        <label className="grid gap-1 text-sm font-semibold text-slate-700">
          Body
          <textarea required maxLength={2000} rows={7} value={form.body} onChange={(event) => setForm({ ...form, body: event.target.value })} className="focus-ring rounded-lg border border-slate-200 px-3 py-2" />
        </label>
        <button className="w-fit bg-apu-crimson px-5 py-3 font-bold text-white hover:bg-crimson-dark">Send announcement</button>
      </form>
    </section>
  );
}
