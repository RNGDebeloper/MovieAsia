import { env } from '@/env.mjs';
import { cn } from '@/lib/utils';

type AdPlacement =
  | 'top-banner'
  | 'native-discovery'
  | 'watch-top'
  | 'watch-vast';

type AdUnitProps = {
  label: string;
  placement: AdPlacement;
  format?: 'banner' | 'native' | 'vast';
  className?: string;
};

const formatCopy = {
  banner: 'Responsive banner placement',
  native: 'Native banner placement',
  vast: 'VAST pre-roll slot',
};

const adCodes: Record<AdPlacement, string | undefined> = {
  'top-banner': env.NEXT_PUBLIC_AD_TOP_BANNER_CODE,
  'native-discovery': env.NEXT_PUBLIC_AD_NATIVE_DISCOVERY_CODE,
  'watch-top': env.NEXT_PUBLIC_AD_WATCH_TOP_CODE,
  'watch-vast': env.NEXT_PUBLIC_AD_WATCH_VAST_CODE,
};

export function AdUnit({
  label,
  placement,
  format = 'banner',
  className,
}: AdUnitProps) {
  const adCode = adCodes[placement]?.trim();

  if (adCode) {
    return (
      <aside
        aria-label={`${label} advertisement`}
        className={cn('mx-auto w-full max-w-6xl', className)}
        dangerouslySetInnerHTML={{ __html: adCode }}
      />
    );
  }

  return (
    <aside
      aria-label={`${label} advertisement`}
      className={cn(
        'mx-auto flex w-full max-w-6xl items-center justify-center rounded-2xl border border-dashed border-zinc-700/80 bg-zinc-950/70 p-3 text-center shadow-lg shadow-black/20',
        className,
      )}>
      <div className="min-h-20 sm:min-h-24 flex w-full flex-col items-center justify-center rounded-xl bg-gradient-to-br from-zinc-900 via-zinc-950 to-black px-4 py-5 ring-1 ring-white/5">
        <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-red-400">
          Advertisement
        </p>
        <p className="mt-2 text-sm font-semibold text-zinc-200 sm:text-base">
          {label}
        </p>
        <p className="mt-1 text-xs text-zinc-500">{formatCopy[format]}</p>
      </div>
    </aside>
  );
}
