'use client';

import clsx from 'clsx';
import { WeatherSnapshot, Settings } from '../lib/types';
import { detailValue } from '../lib/units';
import { useSwipe } from '../lib/gestures';

export function DetailsDrawer({
  open,
  onClose,
  snapshot,
  settings,
}: {
  open: boolean;
  onClose: () => void;
  snapshot: WeatherSnapshot | null;
  settings: Settings;
}) {
  const swipeHandlers = useSwipe(() => undefined, onClose);
  const detailItems = snapshot
    ? [
        { label: 'Humidity', value: `${snapshot.humidity}%` },
        { label: 'Wind', value: detailValue(snapshot, settings, 'wind') },
        { label: 'Feels like', value: detailValue(snapshot, settings, 'feels') },
        { label: 'Rain', value: detailValue(snapshot, settings, 'rain') },
        { label: 'UV', value: `${snapshot.uv}` },
        { label: 'Visibility', value: detailValue(snapshot, settings, 'vis') },
        { label: 'Cloud cover', value: `${snapshot.cloud}%` },
      ]
    : [];

  return (
    <div
      className={clsx(
        'fixed inset-0 z-40 transition-opacity',
        open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
      )}
    >
      <div className="absolute inset-0 drawer-backdrop" onClick={onClose} />
      <aside
        className={clsx(
          'absolute right-0 top-0 h-full w-72 bg-black/82 backdrop-blur-xl px-5 py-6 transition-transform',
          open ? 'translate-x-0' : 'translate-x-full',
        )}
        {...swipeHandlers}
      >
        <div className="border-b border-white/10 pb-3 text-xs font-medium uppercase tracking-[0.28em] text-white/58">Details</div>
        <div className="mt-4 grid gap-3">
          {detailItems.length ? (
            detailItems.map((item) => (
              <DetailItem key={item.label} label={item.label} value={item.value} />
            ))
          ) : (
            <div className="text-sm text-white/60">No data</div>
          )}
        </div>
      </aside>
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-white/5 pb-2 text-sm text-white/85">
      <span className="uppercase tracking-[0.15em] text-[10px] text-white/62">{label}</span>
      <span className="text-base font-light text-white/92">{value}</span>
    </div>
  );
}
