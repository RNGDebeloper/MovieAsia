'use client';

import Link from 'next/link';
import { useEffect } from 'react';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="grid min-h-screen place-items-center bg-background px-4 text-foreground">
      <section className="w-full max-w-lg rounded-3xl border border-zinc-800 bg-zinc-950/80 p-8 text-center shadow-2xl shadow-black/40 sm:p-12">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-red-500">
          Error 500
        </p>
        <h1 className="mt-3 text-3xl font-bold sm:text-4xl">Something went wrong</h1>
        <p className="mt-4 leading-7 text-zinc-400">
          We could not load this page. Please try again or return to the home page.
        </p>
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={reset}
            className="rounded-full bg-red-600 px-5 py-3 font-semibold text-white transition hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-500">
            Try again
          </button>
          <Link href="/home" className="rounded-full border border-zinc-700 px-5 py-3 font-semibold transition hover:bg-zinc-900">
            Return home
          </Link>
        </div>
      </section>
    </main>
  );
}
