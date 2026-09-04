import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-background px-4 text-foreground">
      <section className="w-full max-w-lg rounded-3xl border border-zinc-800 bg-zinc-950/80 p-8 text-center shadow-2xl shadow-black/40 sm:p-12">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-red-500">
          Error 404
        </p>
        <h1 className="mt-3 text-3xl font-bold sm:text-4xl">Page not found</h1>
        <p className="mt-4 leading-7 text-zinc-400">
          This page may have moved, or the address may be incorrect.
        </p>
        <Link
          href="/home"
          className="mt-7 inline-flex rounded-full bg-red-600 px-5 py-3 font-semibold text-white transition hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-black">
          Return home
        </Link>
      </section>
    </main>
  );
}
