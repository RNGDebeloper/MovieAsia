import { redirect } from 'next/navigation';
import { isAdmin } from '@/lib/admin';
import { getEnabledVideoServers, VIDEO_SERVERS } from '@/lib/video-servers';

const adPlacements = ['Home top', 'Home between sections', 'Movie detail', 'Watch before player', 'Watch below player', 'Footer'];

export default function AdminPage() {
  if (!isAdmin()) {
    return <Login />;
  }

  const servers = getEnabledVideoServers();
  const maintenance = process.env.MAINTENANCE_MODE === 'true';
  const announcement = process.env.NEXT_PUBLIC_ANNOUNCEMENT_TITLE;

  return (
    <main className="min-h-screen bg-[#05060b] px-4 py-8 text-white">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div><p className="text-sm uppercase tracking-[0.35em] text-cyan-300">Ottfree Admin</p><h1 className="text-4xl font-bold">Production dashboard</h1></div>
          <form action="/api/admin/logout" method="post"><button className="rounded-full border border-white/15 px-5 py-3">Sign out</button></form>
        </header>
        <section className="grid gap-4 md:grid-cols-4">
          <Metric label="Enabled servers" value={`${servers.length}/${VIDEO_SERVERS.length}`} />
          <Metric label="API status" value="TMDB configured" />
          <Metric label="Maintenance" value={maintenance ? 'On' : 'Off'} />
          <Metric label="Announcement" value={announcement ? 'Active' : 'Inactive'} />
        </section>
        <section className="grid gap-6 lg:grid-cols-2">
          <Panel title="General settings"><p>Configure production settings through Vercel environment variables so mutable data is not written to the serverless filesystem.</p><ul className="mt-4 space-y-2 text-white/70"><li>NEXT_PUBLIC_SITE_NAME</li><li>NEXT_PUBLIC_DEFAULT_VIDEO_SERVER</li><li>NEXT_PUBLIC_DISABLED_VIDEO_SERVERS</li><li>MAINTENANCE_MODE</li><li>NEXT_PUBLIC_MAINTENANCE_MESSAGE</li></ul></Panel>
          <Panel title="Announcement management"><p>Current: {announcement || 'No active announcement'}</p><p className="mt-3 text-white/70">Use NEXT_PUBLIC_ANNOUNCEMENT_TITLE, NEXT_PUBLIC_ANNOUNCEMENT_MESSAGE, and NEXT_PUBLIC_ANNOUNCEMENT_LINK to publish a safe non-intrusive banner.</p></Panel>
          <Panel title="Advertisement management"><p>Supported placements:</p><div className="mt-3 flex flex-wrap gap-2">{adPlacements.map((p) => <span key={p} className="rounded-full bg-white/10 px-3 py-1 text-sm">{p}</span>)}</div><p className="mt-4 text-white/70">Provider credentials and tags must be configured as environment variables or predefined integrations. Arbitrary admin JavaScript is intentionally not executed.</p></Panel>
          <Panel title="Video servers"><div className="grid grid-cols-2 gap-2">{VIDEO_SERVERS.map((server) => <div key={server.id} className="rounded-xl bg-white/10 p-3"><strong>{server.name}</strong><p className="truncate text-xs text-white/60">{server.baseUrl}</p></div>)}</div></Panel>
        </section>
      </div>
    </main>
  );
}

function Login() {
  return <main className="grid min-h-screen place-items-center bg-[#05060b] px-4 text-white"><form action="/api/admin/login" method="post" className="w-full max-w-sm rounded-3xl border border-white/10 bg-white/[0.04] p-6"><h1 className="text-2xl font-bold">Ottfree Admin</h1><p className="mt-2 text-sm text-white/65">Secure access requires server-side environment credentials.</p><label className="mt-6 block text-sm">Password<input name="password" type="password" required className="mt-2 w-full rounded-xl border border-white/10 bg-black px-4 py-3" /></label><button className="mt-5 w-full rounded-xl bg-cyan-300 px-4 py-3 font-bold text-slate-950">Sign in</button></form></main>;
}
function Metric({ label, value }: { label: string; value: string }) { return <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5"><p className="text-sm text-white/60">{label}</p><p className="mt-2 text-2xl font-bold">{value}</p></div>; }
function Panel({ title, children }: { title: string; children: React.ReactNode }) { return <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6"><h2 className="text-xl font-bold">{title}</h2><div className="mt-3 text-white/80">{children}</div></section>; }
