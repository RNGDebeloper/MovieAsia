'use client';

import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';

export function WatchBackButton() {
  const router = useRouter();

  const handleBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
      return;
    }

    router.push('/home');
  };

  return (
    <Button
      type="button"
      variant="ghost"
      onClick={handleBack}
      className="w-fit rounded-full border border-white/10 bg-zinc-900/80 px-4 py-2 text-sm font-semibold text-zinc-100 shadow-lg shadow-black/30 transition hover:border-red-500/60 hover:bg-red-600 hover:text-white focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:ring-offset-black sm:text-base">
      <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
      Back
    </Button>
  );
}
