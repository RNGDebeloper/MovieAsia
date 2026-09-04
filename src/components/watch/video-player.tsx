'use client';

import * as React from 'react';
import { RotateCcw, ShieldCheck, ShieldOff } from 'lucide-react';

import { buildVideoEmbedUrl, type VideoServer } from '@/lib/video-servers';

type Media =
  | {
      type: 'movie';
      id: string | number;
      season?: string | number;
      episode?: string | number;
    }
  | {
      type: 'tv';
      id: string | number;
      season?: string | number;
      episode?: string | number;
    };

export default function VideoPlayer({
  servers,
  media,
  title,
}: {
  servers: VideoServer[];
  media: Media;
  title: string;
}) {
  const activeServer = servers[0];
  const [isLoading, setIsLoading] = React.useState(Boolean(activeServer));
  const [reloadKey, setReloadKey] = React.useState(0);
  const [sandboxEnabled, setSandboxEnabled] = React.useState(
    process.env.NEXT_PUBLIC_VIDEO_SANDBOX_ENABLED !== 'false',
  );
  const src = activeServer ? buildVideoEmbedUrl(activeServer, media) : '';

  React.useEffect(() => {
    if (!src) return;
    setIsLoading(true);
  }, [src, reloadKey]);

  if (!activeServer) {
    return (
      <div className="rounded-3xl border border-red-500/40 bg-red-950/30 p-8 text-center text-red-100">
        No video servers are currently enabled.
      </div>
    );
  }

  return (
    <section className="space-y-4" aria-label="Ottfree video player">
      <div className="relative aspect-video min-h-[220px] overflow-hidden rounded-2xl border border-zinc-800 bg-black shadow-2xl shadow-black outline-none ring-1 ring-white/5 sm:min-h-0 sm:rounded-3xl">
        {isLoading && (
          <div className="absolute inset-0 z-10 grid place-items-center bg-black">
            <div className="rounded-full border border-red-500/30 bg-zinc-950 px-5 py-3 text-sm font-medium text-zinc-100 shadow-lg shadow-red-950/30">
              Loading secure main player…
            </div>
          </div>
        )}
        <iframe
          key={`${src}-${reloadKey}`}
          title={`${title} on Ottfree main server`}
          src={src}
          className="h-full w-full border-0"
          allowFullScreen
          loading="eager"
          referrerPolicy="no-referrer"
          sandbox={
            sandboxEnabled
              ? 'allow-scripts allow-same-origin allow-presentation'
              : undefined
          }
          allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
          onLoad={() => setIsLoading(false)}
        />
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border border-zinc-800 bg-zinc-950/80 p-4 text-sm text-zinc-300 shadow-xl shadow-black/30 sm:flex-row sm:items-center sm:justify-between sm:rounded-3xl">
        <div>
          <h2 className="font-bold text-white">Main Server</h2>
          <p className="mt-1 text-xs leading-5 text-zinc-400">
            {sandboxEnabled
              ? 'The restricted iframe sandbox helps block popups, top-page redirects, and invasive third-party behavior.'
              : 'The iframe sandbox is off for compatibility. Turn it back on to block popups and top-page redirects.'}
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              setSandboxEnabled((enabled) => !enabled);
              setReloadKey((key) => key + 1);
            }}
            aria-pressed={sandboxEnabled}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs font-semibold text-emerald-300 transition hover:bg-emerald-500/20 focus:outline-none focus:ring-2 focus:ring-emerald-500">
            {sandboxEnabled ? (
              <ShieldCheck className="h-4 w-4" aria-hidden="true" />
            ) : (
              <ShieldOff className="h-4 w-4" aria-hidden="true" />
            )}
            Sandbox {sandboxEnabled ? 'on' : 'off'}
          </button>
          <button
            type="button"
            onClick={() => setReloadKey((key) => key + 1)}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-zinc-700 px-3 py-2 text-xs font-semibold text-zinc-200 transition hover:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-400">
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            Reload player
          </button>
        </div>
      </div>
    </section>
  );
}
