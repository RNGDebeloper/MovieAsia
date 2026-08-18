import { isAdmin } from '@/lib/admin';
import { getEnabledVideoServers, VIDEO_SERVERS } from '@/lib/video-servers';

const adPlacements = [
  'Home top',
  'Home between sections',
  'Movie detail',
  'Watch before player',
  'Watch below player',
  'Footer',
];

export default function AdminPage() {
  if (!isAdmin()) {
    return <Login />;
  }

  const servers = getEnabledVideoServers();
  const maintenance = process.env.MAINTENANCE_MODE === 'true';
  const announcement = process.env.NEXT_PUBLIC_ANNOUNCEMENT_TITLE;

  return (
    <main className="min-h-screen bg-background px-4 py-8 text-foreground">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-zinc-800 bg-zinc-950/80 p-6 shadow-2xl shadow-black/40">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-red-500">
              Ottfree Admin
            </p>
            <h1 className="text-4xl font-bold">Production dashboard</h1>
          </div>
          <form action="/api/admin/logout" method="post">
            <button className="rounded-full border border-zinc-700 px-5 py-3 transition hover:border-red-500 hover:bg-red-600">
              Sign out
            </button>
          </form>
        </header>
        <section className="grid gap-4 md:grid-cols-4">
          <Metric
            label="Enabled servers"
            value={`${servers.length}/${VIDEO_SERVERS.length}`}
          />
          <Metric label="API status" value="TMDB configured" />
          <Metric label="Maintenance" value={maintenance ? 'On' : 'Off'} />
          <Metric
            label="Announcement"
            value={announcement ? 'Active' : 'Inactive'}
          />
        </section>
        <section className="grid gap-6 lg:grid-cols-2">
          <Panel title="General settings">
            <p>
              Configure production settings through Vercel environment variables
              so mutable data is not written to the serverless filesystem.
            </p>
            <ul className="mt-4 space-y-2 text-zinc-400">
              <li>NEXT_PUBLIC_SITE_NAME</li>
              <li>NEXT_PUBLIC_DEFAULT_VIDEO_SERVER</li>
              <li>NEXT_PUBLIC_DISABLED_VIDEO_SERVERS</li>
              <li>MAINTENANCE_MODE</li>
              <li>NEXT_PUBLIC_MAINTENANCE_MESSAGE</li>
            </ul>
          </Panel>
          <Panel title="Admin credentials">
            <p>
              Admin access is checked on the server with ADMIN_USERNAME,
              ADMIN_PASSWORD, and ADMIN_SESSION_SECRET.
            </p>
            <p className="mt-3 text-zinc-400">
              Set or rotate those values in your deployment environment. Do not
              commit real credentials.
            </p>
          </Panel>
          <Panel title="Announcement management">
            <p>Current: {announcement || 'No active announcement'}</p>
            <p className="mt-3 text-zinc-400">
              Use NEXT_PUBLIC_ANNOUNCEMENT_TITLE,
              NEXT_PUBLIC_ANNOUNCEMENT_MESSAGE, and
              NEXT_PUBLIC_ANNOUNCEMENT_LINK to publish a safe non-intrusive
              banner.
            </p>
          </Panel>
          <Panel title="Advertisement management">
            <p>Supported placements:</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {adPlacements.map((p) => (
                <span
                  key={p}
                  className="rounded-full bg-zinc-900 px-3 py-1 text-sm ring-1 ring-zinc-800">
                  {p}
                </span>
              ))}
            </div>
            <p className="mt-4 text-zinc-400">
              Provider credentials and tags must be configured as environment
              variables or predefined integrations. Arbitrary admin JavaScript
              is intentionally not executed.
            </p>
          </Panel>
          <Panel title="Video servers">
            <div className="grid grid-cols-2 gap-2">
              {VIDEO_SERVERS.map((server) => (
                <div
                  key={server.id}
                  className="rounded-xl bg-zinc-900 p-3 ring-1 ring-zinc-800">
                  <strong>{server.name}</strong>
                  <p className="truncate text-xs text-zinc-500">
                    {server.baseUrl}
                  </p>
                </div>
              ))}
            </div>
          </Panel>
        </section>
      </div>
    </main>
  );
}

function Login() {
  return (
    <main className="grid min-h-screen place-items-center bg-background px-4 text-foreground">
      <form
        action="/api/admin/login"
        method="post"
        className="w-full max-w-sm rounded-3xl border border-zinc-800 bg-zinc-950/90 p-6 shadow-2xl shadow-black/50">
        <h1 className="text-2xl font-bold">Ottfree Admin</h1>
        <p className="mt-2 text-sm text-zinc-400">
          Secure access requires server-side environment credentials.
        </p>
        <label className="mt-6 block text-sm">
          Username
          <input
            name="username"
            type="text"
            required
            autoComplete="username"
            className="mt-2 w-full rounded-xl border border-zinc-700 bg-black px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </label>
        <label className="mt-4 block text-sm">
          Password
          <input
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className="mt-2 w-full rounded-xl border border-zinc-700 bg-black px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </label>
        <button className="mt-5 w-full rounded-xl bg-red-600 px-4 py-3 font-bold text-white transition hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-black">
          Sign in
        </button>
      </form>
    </main>
  );
}
function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-950/80 p-5">
      <p className="text-sm text-zinc-400">{label}</p>
      <p className="mt-2 text-2xl font-bold">{value}</p>
    </div>
  );
}
function Panel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-zinc-800 bg-zinc-950/80 p-6">
      <h2 className="text-xl font-bold text-white">{title}</h2>
      <div className="mt-3 text-zinc-300">{children}</div>
    </section>
  );
}
