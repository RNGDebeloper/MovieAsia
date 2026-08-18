'use client';

import * as React from 'react';
import { RefreshCcw } from 'lucide-react';

import { buildVideoEmbedUrl, type VideoServer } from '@/lib/video-servers';
import { cn } from '@/lib/utils';

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
  const [activeServer, setActiveServer] = React.useState(servers[0]);
  const [isLoading, setIsLoading] = React.useState(Boolean(servers[0]));
  const [isSwitching, setIsSwitching] = React.useState(false);
  const [hasError, setHasError] = React.useState(false);
  const [reloadKey, setReloadKey] = React.useState(0);
  const previousSrc = React.useRef('');
  const src = activeServer ? buildVideoEmbedUrl(activeServer, media) : '';

  React.useEffect(() => {
    if (!src) return;
    setIsSwitching(Boolean(previousSrc.current) && previousSrc.current !== src);
    previousSrc.current = src;
    setIsLoading(true);
    setHasError(false);
  }, [src, reloadKey]);

  const retry = () => {
    setHasError(false);
    setIsLoading(true);
    setReloadKey((key) => key + 1);
  };

  if (!activeServer) {
    return (
      <div className="rounded-3xl border border-red-500/40 bg-red-950/30 p-8 text-center text-red-100">
        No video servers are currently enabled.
      </div>
    );
  }

  return (
    <section className="space-y-5" aria-label="Ottfree video player">
      <div className="relative aspect-video overflow-hidden rounded-2xl border border-zinc-800 bg-black shadow-2xl shadow-black outline-none ring-1 ring-white/5 sm:rounded-3xl">
        {(isLoading || isSwitching) && (
          <div className="absolute inset-0 z-10 grid place-items-center bg-black">
            <div className="rounded-full border border-red-500/30 bg-zinc-950 px-5 py-3 text-sm font-medium text-zinc-100 shadow-lg shadow-red-950/30">
              {isSwitching
                ? `Switching to ${activeServer.name}…`
                : `Loading ${activeServer.name}…`}
            </div>
          </div>
        )}
        {hasError && (
          <div className="absolute inset-0 z-20 grid place-items-center bg-black/95 p-6 text-center">
            <div className="max-w-md">
              <h2 className="text-xl font-semibold text-white">
                This server could not be loaded
              </h2>
              <p className="mt-2 text-zinc-400">
                Retry this server or choose another one below to continue
                watching.
              </p>
              <button
                type="button"
                onClick={retry}
                className="mt-5 inline-flex items-center rounded-full bg-red-600 px-5 py-3 font-semibold text-white transition hover:bg-red-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:ring-offset-black">
                <RefreshCcw className="mr-2 h-4 w-4" aria-hidden="true" />
                Retry
              </button>
            </div>
          </div>
        )}
        <iframe
          key={`${src}-${reloadKey}`}
          title={`${title} on ${activeServer.name}`}
          src={src}
          className="h-full w-full border-0"
          allowFullScreen
          loading="eager"
          referrerPolicy="no-referrer"
          sandbox="allow-scripts allow-same-origin allow-forms allow-presentation"
          allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
          onLoad={() => {
            setIsLoading(false);
            setIsSwitching(false);
          }}
          onError={() => {
            setIsLoading(false);
            setIsSwitching(false);
            setHasError(true);
          }}
        />
      </div>
      <div className="rounded-3xl border border-zinc-800 bg-zinc-950/80 p-4 shadow-xl shadow-black/30 sm:p-6">
        <h2 className="text-center text-sm font-bold uppercase tracking-[0.35em] text-zinc-300">
          Servers
        </h2>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5 xl:grid-cols-10">
          {servers.map((server) => (
            <button
              key={server.id}
              type="button"
              onClick={() =>
                activeServer.id !== server.id && setActiveServer(server)
              }
              className={cn(
                'min-h-12 rounded-2xl border px-3 py-3 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-black',
                activeServer.id === server.id
                  ? 'border-red-500 bg-red-600 text-white shadow-lg shadow-red-950/40'
                  : 'border-zinc-700 bg-zinc-900 text-zinc-200 hover:border-red-500/50 hover:bg-zinc-800',
              )}
              aria-pressed={activeServer.id === server.id}>
              {server.name}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
