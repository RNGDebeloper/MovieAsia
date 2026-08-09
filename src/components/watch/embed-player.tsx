'use client';

import React from 'react';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';

interface EmbedPlayerProps {
  url: string;
  title?: string;
  subtitle?: string;
}

function EmbedPlayer({
  url,
  title = 'Now playing',
  subtitle,
}: EmbedPlayerProps) {
  const ref = React.useRef<HTMLIFrameElement>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [hasTimedOut, setHasTimedOut] = React.useState(false);

  React.useEffect(() => {
    setIsLoading(true);
    setHasTimedOut(false);
    const timeout = window.setTimeout(() => {
      setHasTimedOut(true);
      setIsLoading(false);
    }, 15000);

    return () => window.clearTimeout(timeout);
  }, [url]);

  const handleIframeLoaded = () => {
    setIsLoading(false);
    setHasTimedOut(false);
  };

  const handleFullscreen = async () => {
    if (!ref.current?.requestFullscreen) return;
    await ref.current.requestFullscreen();
  };

  return (
    <main className="min-h-screen bg-black text-white">
      <section className="mx-auto flex min-h-screen w-full max-w-[1800px] flex-col px-3 py-4 sm:px-5 lg:px-8 lg:py-6">
        <div className="mb-3 flex flex-col gap-3 sm:mb-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-300">
              Chillkaro Player
            </p>
            <h1 className="truncate text-xl font-bold sm:text-2xl lg:text-4xl">
              {title}
            </h1>
            {subtitle ? (
              <p className="mt-1 text-sm text-zinc-400 sm:text-base">
                {subtitle}
              </p>
            ) : null}
          </div>
          <Button
            type="button"
            onClick={handleFullscreen}
            className="min-h-11 rounded-full bg-white px-5 text-black hover:bg-orange-100 focus-visible:ring-orange-400">
            Fullscreen
          </Button>
        </div>

        <div className="relative isolate flex-1 overflow-hidden rounded-2xl border border-white/10 bg-zinc-950 shadow-2xl shadow-orange-950/30">
          <div className="aspect-video min-h-[55vh] w-full lg:min-h-[72vh]">
            <iframe
              ref={ref}
              src={url}
              title={title}
              className="h-full w-full bg-black transition-opacity duration-500"
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
              allowFullScreen
              loading="eager"
              referrerPolicy="no-referrer-when-downgrade"
              onLoad={handleIframeLoaded}
            />
          </div>

          {isLoading ? (
            <div className="absolute inset-0 grid place-items-center bg-black/80 text-center">
              <div className="space-y-3 px-6">
                <Icons.spinner
                  className="mx-auto h-10 w-10 animate-spin text-orange-400"
                  aria-hidden="true"
                />
                <p className="text-lg font-semibold">Loading your stream…</p>
                <p className="text-sm text-zinc-400">
                  If playback does not start, try refreshing or check your
                  connection.
                </p>
              </div>
            </div>
          ) : null}

          {hasTimedOut ? (
            <div className="absolute inset-x-4 bottom-4 rounded-xl border border-orange-400/30 bg-zinc-950/95 p-4 shadow-xl backdrop-blur">
              <p className="font-semibold text-orange-200">
                The player is taking longer than expected.
              </p>
              <p className="mt-1 text-sm text-zinc-300">
                Refresh the page or try again later. Some third-party streams
                may be temporarily unavailable.
              </p>
            </div>
          ) : null}
        </div>

        <p className="mt-4 max-w-3xl text-sm leading-6 text-zinc-400">
          Playback is provided by a third-party embedded player. Chillkaro keeps
          the surrounding interface clean; any third-party notices or ads are
          controlled by that provider.
        </p>
      </section>
    </main>
  );
}

export default EmbedPlayer;
