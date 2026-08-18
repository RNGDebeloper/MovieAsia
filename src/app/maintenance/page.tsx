export default function MaintenancePage() {
  return <main className="grid min-h-screen place-items-center bg-[#05060b] px-5 text-center text-white"><section className="max-w-xl rounded-3xl border border-white/10 bg-white/[0.04] p-8"><p className="text-sm font-semibold uppercase tracking-[0.35em] text-cyan-300">Ottfree</p><h1 className="mt-4 text-4xl font-bold">We’ll be right back</h1><p className="mt-4 text-white/70">{process.env.NEXT_PUBLIC_MAINTENANCE_MESSAGE || 'Ottfree is undergoing scheduled maintenance. Please check back shortly.'}</p></section></main>;
}
