'use client';

import * as React from 'react';
import { buildVideoEmbedUrl, type VideoServer } from '@/lib/video-servers';
import { cn } from '@/lib/utils';

type Media =
  | { type: 'movie'; id: string | number; season?: string | number; episode?: string | number }
  | { type: 'tv'; id: string | number; season?: string | number; episode?: string | number };

export default function VideoPlayer({ servers, media, title }: { servers: VideoServer[]; media: Media; title: string }) {
  const [activeServer, setActiveServer] = React.useState(servers[0]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [hasError, setHasError] = React.useState(false);
  const src = activeServer ? buildVideoEmbedUrl(activeServer, media) : '';

  React.useEffect(() => {
    setIsLoading(true);
    setHasError(false);
  }, [src]);

  if (!activeServer) {
    return <div className="rounded-3xl border border-red-400/30 bg-red-950/30 p-8 text-center">No video servers are currently enabled.</div>;
  }

  return (
    <section className="space-y-5" aria-label="Ottfree video player">
      <div className="relative aspect-video overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl shadow-cyan-950/40 outline-none sm:rounded-3xl">
        {isLoading && <div className="absolute inset-0 z-10 grid place-items-center bg-black"><div className="rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm font-medium text-white/80">Loading {activeServer.name}…</div></div>}
        {hasError && <div className="absolute inset-0 z-20 grid place-items-center bg-black/90 p-6 text-center"><div><h2 className="text-xl font-semibold">This server could not be loaded</h2><p className="mt-2 text-white/70">Choose another server below to continue watching.</p></div></div>}
        <iframe
          key={src}
          title={`${title} on ${activeServer.name}`}
          src={src}
          className="h-full w-full border-0"
          allowFullScreen
          loading="eager"
          referrerPolicy="no-referrer"
          sandbox="allow-scripts allow-same-origin allow-forms allow-presentation allow-popups"
          allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
          onLoad={() => setIsLoading(false)}
          onError={() => { setIsLoading(false); setHasError(true); }}
        />
      </div>
      <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-4 sm:p-6">
        <h2 className="text-center text-sm font-bold uppercase tracking-[0.35em] text-white/70">Watch on server</h2>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5 xl:grid-cols-10">
          {servers.map((server) => (
            <button
              key={server.id}
              type="button"
              onClick={() => setActiveServer(server)}
              className={cn('min-h-12 rounded-2xl border px-3 py-3 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-cyan-300', activeServer.id === server.id ? 'border-cyan-300 bg-cyan-300 text-slate-950' : 'border-white/10 bg-white/10 text-white hover:bg-white/15')}
              aria-pressed={activeServer.id === server.id}>
              {server.name}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
