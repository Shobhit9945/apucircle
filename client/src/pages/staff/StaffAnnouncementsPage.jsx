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
    <section className="max-w-2xl">
      <SectionHeader title="Platform Announcements" eyebrow="Staff Broadcast" />

      <div className="card p-6 mb-6 flex items-start gap-4">
        <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center flex-shrink-0">
          <span className="material-symbols-outlined text-on-primary-container text-[20px]">campaign</span>
        </div>
        <div>
          <p className="text-label-lg text-on-surface font-semibold">Institutional Broadcast</p>
          <p className="text-body-sm text-on-surface-variant mt-1">
            Post announcements globally to all users and club pages. Use sparingly for important university-wide communications.
          </p>
        </div>
      </div>

      <form onSubmit={submit} className="card p-6 space-y-4">
        <div className="space-y-1">
          <label className="text-label-lg text-on-surface font-semibold">Title</label>
          <input
            required
            maxLength={140}
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="e.g., Club Fair Registration Open..."
            className="w-full bg-surface-container-lowest border border-outline-variant text-on-surface rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-body-md"
          />
        </div>
        <div className="space-y-1">
          <label className="text-label-lg text-on-surface font-semibold">Message</label>
          <textarea
            required
            maxLength={2000}
            rows={7}
            value={form.body}
            onChange={(e) => setForm({ ...form, body: e.target.value })}
            placeholder="Type announcement details here..."
            className="w-full bg-surface-container-lowest border border-outline-variant text-on-surface rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-body-md resize-none"
          />
        </div>
        <button className="w-full bg-primary text-on-primary rounded-full py-3 text-label-lg font-semibold hover:bg-primary-container transition-colors flex items-center justify-center gap-2">
          <span className="material-symbols-outlined text-[18px]">send</span>
          Send Announcement
        </button>
      </form>
    </section>
  );
}
