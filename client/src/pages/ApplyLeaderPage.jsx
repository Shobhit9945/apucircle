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
    <section>
      <SectionHeader title="Apply for club leader" eyebrow="Staff approval required" />
      <form onSubmit={submit} className="card grid max-w-3xl gap-5 p-5">
        <label className="grid gap-1 text-sm font-semibold text-slate-700">
          Club
          <select required value={form.clubId} onChange={(event) => setForm({ ...form, clubId: event.target.value })} className="focus-ring rounded-lg border border-slate-200 px-3 py-2">
            <option value="">Select a club</option>
            {clubs.map((club) => (
              <option value={club._id} key={club._id}>
                {club.name}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-1 text-sm font-semibold text-slate-700">
          Reason
          <textarea
            required
            minLength={50}
            maxLength={500}
            rows={6}
            value={form.reason}
            onChange={(event) => setForm({ ...form, reason: event.target.value })}
            className="focus-ring rounded-lg border border-slate-200 px-3 py-2"
          />
        </label>
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm font-semibold text-slate-500">{form.reason.length}/500</span>
          <button className="focus-ring bg-apu-crimson px-5 py-3 font-bold text-white hover:bg-crimson-dark">Submit application</button>
        </div>
      </form>
    </section>
  );
}
