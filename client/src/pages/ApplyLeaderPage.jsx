import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import SectionHeader from '../components/SectionHeader.jsx';
import { api, errorMessage } from '../api/client.js';

export default function ApplyLeaderPage() {
  const [clubs, setClubs] = useState([]);
  const [form, setForm] = useState({ clubId: '', reason: '' });

  useEffect(() => {
    api.get('/clubs?limit=50').then(({ data }) => setClubs(data.clubs || []));
  }, []);

  async function submit(event) {
    event.preventDefault();
    try {
      await api.post('/users/applications', form);
      toast.success('Application submitted');
      setForm({ clubId: '', reason: '' });
    } catch (error) {
      toast.error(errorMessage(error, 'Could not submit application'));
    }
  }

  return (
    <section className="max-w-2xl">
      <SectionHeader title="Apply for Club Leader" eyebrow="Staff Approval Required" />

      <div className="card p-6 mb-6 flex items-start gap-4 bg-primary-fixed/30 border-primary-fixed-dim">
        <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center flex-shrink-0">
          <span className="material-symbols-outlined text-on-primary-container text-[20px]">workspace_premium</span>
        </div>
        <div>
          <p className="text-label-lg text-on-surface font-semibold">Club Leader Role</p>
          <p className="text-body-sm text-on-surface-variant mt-1">
            As a club leader, you'll be able to post announcements, create events, and manage club membership. Your application will be reviewed by university staff.
          </p>
        </div>
      </div>

      <form onSubmit={submit} className="card p-6 space-y-5">
        <div className="space-y-1">
          <label className="text-label-lg text-on-surface font-semibold">Select a Club</label>
          <select
            required
            value={form.clubId}
            onChange={(e) => setForm({ ...form, clubId: e.target.value })}
            className="w-full bg-surface-container-lowest border border-outline-variant text-on-surface rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-body-md"
          >
            <option value="">Choose a club...</option>
            {clubs.map((club) => (
              <option key={club._id} value={club._id}>{club.name}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-label-lg text-on-surface font-semibold">Why do you want to lead?</label>
          <textarea
            required
            minLength={50}
            maxLength={500}
            rows={6}
            value={form.reason}
            onChange={(e) => setForm({ ...form, reason: e.target.value })}
            placeholder="Explain your motivation, relevant experience, and goals as a club leader (min 50 characters)..."
            className="w-full bg-surface-container-lowest border border-outline-variant text-on-surface rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-body-md resize-none"
          />
          <p className="text-label-md text-on-surface-variant text-right">{form.reason.length}/500</p>
        </div>

        <button className="w-full bg-primary text-on-primary rounded-full py-3 text-label-lg font-semibold hover:bg-primary-container transition-colors flex items-center justify-center gap-2">
          <span className="material-symbols-outlined text-[18px]">send</span>
          Submit Application
        </button>
      </form>
    </section>
  );
}
