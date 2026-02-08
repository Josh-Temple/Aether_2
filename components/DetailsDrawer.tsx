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
        { label: 'Hum', value: `${snapshot.humidity}%` },
        { label: 'Wind', value: detailValue(snapshot, settings, 'wind') },
        { label: 'Feels', value: detailValue(snapshot, settings, 'feels') },
        { label: 'Rain', value: detailValue(snapshot, settings, 'rain') },
        { label: 'UV', value: `${snapshot.uv}` },
        { label: 'Vis', value: detailValue(snapshot, settings, 'vis') },
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
          'absolute right-0 top-0 h-full w-72 bg-black/80 backdrop-blur-xl p-6 transition-transform',
          open ? 'translate-x-0' : 'translate-x-full',
        )}
        {...swipeHandlers}
      >
        <div className="text-xs uppercase tracking-[0.3em] text-white/40">Details</div>
        <div className="mt-8 grid gap-4">
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
    <div className="flex items-center justify-between text-sm text-white/80">
      <span className="uppercase tracking-[0.2em] text-[10px] text-white/50">{label}</span>
      <span className="text-base font-light">{value}</span>
    </div>
  );
}
