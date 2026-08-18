export default function MaintenancePage() {
  return (
    <main className="grid min-h-screen place-items-center bg-background px-5 text-center text-white">
      <section className="max-w-xl rounded-3xl border border-zinc-800 bg-zinc-950/80 p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-red-500">
          Ottfree
        </p>
        <h1 className="mt-4 text-4xl font-bold">We’ll be right back</h1>
        <p className="mt-4 text-zinc-400">
          {process.env.NEXT_PUBLIC_MAINTENANCE_MESSAGE ||
            'Ottfree is undergoing scheduled maintenance. Please check back shortly.'}
        </p>
      </section>
    </main>
  );
}
