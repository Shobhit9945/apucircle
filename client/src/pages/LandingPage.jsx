import { ArrowRight, CalendarDays, Search, ShieldCheck, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <main>
      <section className="relative overflow-hidden bg-black text-white">
        <img
          src="/assets/ritsumeikan-apu.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-70"
        />
        <div className="absolute inset-x-0 top-0 h-2 bg-apu-crimson" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/75 to-black/10" />
        <div className="relative mx-auto grid min-h-[76vh] max-w-7xl content-center px-4 py-20 sm:px-6 lg:px-8">
          <div className="max-w-3xl border-l-4 border-apu-crimson pl-6">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-white/75">Ritsumeikan Asia Pacific University</p>
            <h1 className="font-heading text-5xl font-black leading-none sm:text-7xl">APUCircle</h1>
            <p className="mt-5 max-w-2xl text-xl font-medium text-white">
              A year-round hub for discovering clubs, following campus events, and staying connected inside the communities you join.
            </p>
            <p className="mt-4 text-sm font-bold uppercase tracking-[0.18em] text-white/70">Shape your world</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/register" className="focus-ring inline-flex items-center gap-2 bg-apu-crimson px-5 py-3 font-bold text-white hover:bg-crimson-dark">
                Register <ArrowRight size={18} />
              </Link>
              <Link to="/clubs" className="focus-ring inline-flex items-center gap-2 border border-white bg-white px-5 py-3 font-bold text-black hover:bg-mist">
                Explore clubs
              </Link>
            </div>
            <p className="mt-5 text-xs font-medium text-white/55">
              Campus photo: AdiDeWitt, CC BY-SA 4.0.
            </p>
          </div>
        </div>
      </section>
      <section className="page-shell -mt-10 grid gap-4 md:grid-cols-3">
        {[
          { icon: Search, title: 'Interest-based discovery', text: 'Find clubs by tags, category, language, and activity status.' },
          { icon: CalendarDays, title: 'Events in one place', text: 'See upcoming events from communities you already joined.' },
          { icon: ShieldCheck, title: 'Verified activity', text: 'Staff verification and activity badges keep listings trustworthy.' }
        ].map((item) => {
          const Icon = item.icon;
          return (
            <article key={item.title} className="card apu-rule p-5">
              <div className="mb-4 inline-flex border border-line bg-mist p-3 text-apu-crimson">
                <Icon size={22} />
              </div>
              <h2 className="font-heading text-lg font-black text-navy">{item.title}</h2>
              <p className="mt-2 text-sm text-slate-600">{item.text}</p>
            </article>
          );
        })}
      </section>
      <section className="page-shell grid gap-8 lg:grid-cols-[1fr_0.8fr]">
        <div>
          <p className="apu-kicker">For students and leaders</p>
          <h2 className="mt-2 font-heading text-3xl font-black text-navy">One familiar dashboard, permissions where they matter.</h2>
          <p className="mt-4 text-slate-600">
            Club leaders keep the same discovery-first experience as other students, with management tools appearing inside their own club spaces.
          </p>
        </div>
        <div className="card grid gap-4 p-5">
          <div className="flex items-center gap-3">
            <Users className="text-apu-crimson" />
            <div>
              <p className="font-bold text-navy">Join request flow</p>
              <p className="text-sm text-slate-600">Students request, leaders approve, members get notified.</p>
            </div>
          </div>
          <div className="rounded-lg bg-mist p-4 text-sm text-slate-600">
            Announcements support emoji reactions, so club spaces are more expressive than one-way message blasts.
          </div>
        </div>
      </section>
    </main>
  );
}
