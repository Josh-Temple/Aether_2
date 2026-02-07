'use client';

import clsx from 'clsx';
import Link from 'next/link';
import { SavedLocation } from '../lib/types';

export function LocationMenu({
  open,
  onClose,
  currentLabel,
  savedLocations,
  onSelect,
  onMove,
  onOpenSettings,
}: {
  open: boolean;
  onClose: () => void;
  currentLabel: string;
  savedLocations: SavedLocation[];
  onSelect: (location: SavedLocation | 'current') => void;
  onMove: (id: string, direction: 'up' | 'down') => void;
  onOpenSettings: () => void;
}) {
  return (
    <div
      className={clsx(
        'fixed inset-0 z-50 transition-opacity',
        open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
      )}
    >
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="absolute left-1/2 top-10 w-[90%] max-w-sm -translate-x-1/2 rounded-3xl bg-neutral-900/90 p-6 text-white shadow-xl">
        <div className="flex items-center justify-between">
          <div className="text-xs uppercase tracking-[0.3em] text-white/50">Locations</div>
          <button
            type="button"
            onClick={onOpenSettings}
            className="rounded-full border border-white/20 px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-white/70"
          >
            Settings
          </button>
        </div>
        <div className="mt-5 space-y-3">
          <button
            type="button"
            onClick={() => onSelect('current')}
            className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left"
          >
            <span className="text-sm">{currentLabel}</span>
            <span className="h-2 w-2 rounded-full bg-emerald-400/70" />
          </button>
          {savedLocations.map((location, index) => (
            <div
              key={location.id}
              className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
            >
              <button
                type="button"
                onClick={() => onSelect(location)}
                className="flex-1 text-left text-sm"
              >
                {location.name}
              </button>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={index === 0}
                  onClick={() => onMove(location.id, 'up')}
                  className="text-[10px] uppercase tracking-[0.2em] text-white/60 disabled:opacity-30"
                >
                  Up
                </button>
                <button
                  type="button"
                  disabled={index === savedLocations.length - 1}
                  onClick={() => onMove(location.id, 'down')}
                  className="text-[10px] uppercase tracking-[0.2em] text-white/60 disabled:opacity-30"
                >
                  Down
                </button>
              </div>
            </div>
          ))}
          <Link
            href="/search"
            className="block rounded-2xl border border-dashed border-white/30 px-4 py-3 text-center text-xs uppercase tracking-[0.3em] text-white/60"
          >
            Add location
          </Link>
        </div>
      </div>
    </div>
  );
}
