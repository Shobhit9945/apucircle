import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <main className="font-sans">
      {/* Hero */}
      <section className="relative overflow-hidden bg-black text-on-primary min-h-[75vh] flex items-center">
        <img
          src="/assets/ritsumeikan-apu.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-black/10" />
        <div className="relative mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-label-lg text-white/60 uppercase tracking-widest mb-4">
              Ritsumeikan Asia Pacific University
            </p>
            <h1 className="text-display font-bold leading-none text-white">APUCircle</h1>
            <p className="mt-6 text-body-lg text-white/80 max-w-xl">
              A year-round hub for discovering clubs, following campus events, and staying connected inside the communities you join.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 bg-primary text-on-primary px-6 py-3 rounded-full text-label-lg font-semibold hover:bg-primary-container transition-colors shadow-sm"
              >
                Get started
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </Link>
              <Link
                to="/clubs"
                className="inline-flex items-center gap-2 bg-white/10 text-white border border-white/30 px-6 py-3 rounded-full text-label-lg font-semibold hover:bg-white/20 transition-colors backdrop-blur-sm"
              >
                Explore clubs
              </Link>
            </div>
            <p className="mt-8 text-label-md text-white/40">
              Campus photo: AdiDeWitt, CC BY-SA 4.0.
            </p>
          </div>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="mx-auto max-w-7xl px-6 lg:px-8 py-16">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              icon: 'search',
              title: 'Interest-based discovery',
              text: 'Find clubs by tags, category, language, and activity status.',
              color: 'bg-primary-fixed text-primary'
            },
            {
              icon: 'event',
              title: 'Events in one place',
              text: 'See upcoming events from communities you already joined.',
              color: 'bg-tertiary-fixed text-tertiary'
            },
            {
              icon: 'verified',
              title: 'Verified activity',
              text: 'Staff verification and activity badges keep listings trustworthy.',
              color: 'bg-secondary-container text-secondary'
            }
          ].map((item) => (
            <article key={item.title} className="card p-6">
              <div className={`inline-flex p-3 rounded-xl mb-4 ${item.color}`}>
                <span className="material-symbols-outlined">{item.icon}</span>
              </div>
              <h2 className="text-headline-sm font-semibold text-on-surface">{item.title}</h2>
              <p className="mt-2 text-body-sm text-on-surface-variant">{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Details Section */}
      <section className="mx-auto max-w-7xl px-6 lg:px-8 pb-20">
        <div className="grid gap-10 lg:grid-cols-[1fr_0.9fr] items-start">
          <div>
            <p className="text-label-lg text-primary font-semibold uppercase tracking-wider mb-2">
              For students and leaders
            </p>
            <h2 className="text-headline-lg font-bold text-on-surface">
              One familiar dashboard, permissions where they matter.
            </h2>
            <p className="mt-4 text-body-md text-on-surface-variant">
              Club leaders keep the same discovery-first experience as other students, with management tools appearing inside their own club spaces.
            </p>
          </div>
          <div className="card p-6 space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-on-primary-container text-[20px]">group_add</span>
              </div>
              <div>
                <p className="text-label-lg text-on-surface font-semibold">Join request flow</p>
                <p className="text-body-sm text-on-surface-variant">Students request, leaders approve, members get notified.</p>
              </div>
            </div>
            <div className="rounded-xl bg-surface-container p-4 text-body-sm text-on-surface-variant">
              Announcements support emoji reactions, so club spaces are more expressive than one-way message blasts.
            </div>
            <div className="flex gap-3">
              <Link
                to="/register"
                className="flex-1 bg-primary text-on-primary px-4 py-3 rounded-full text-label-lg font-semibold text-center hover:bg-primary-container transition-colors"
              >
                Join APUCircle
              </Link>
              <Link
                to="/login"
                className="flex-1 border border-outline-variant text-on-surface px-4 py-3 rounded-full text-label-lg font-semibold text-center hover:bg-surface-container-high transition-colors"
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
