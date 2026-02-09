'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { loadSavedLocations, saveSavedLocations, saveActiveLocationId } from '../../lib/storage';
import { searchLocations, type WeatherSearchResult } from '../../lib/weather';
import type { SavedLocation } from '../../lib/types';

export default function SearchPage() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<WeatherSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [savedLocations, setSavedLocations] = useState<SavedLocation[]>([]);
  const [pending, setPending] = useState<WeatherSearchResult | null>(null);

  useEffect(() => {
    setSavedLocations(loadSavedLocations());
  }, []);

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }
    const handle = setTimeout(async () => {
      setLoading(true);
      const data = await searchLocations(query);
      setResults(data);
      setLoading(false);
    }, 300);
    return () => clearTimeout(handle);
  }, [query]);

  const limitReached = savedLocations.length >= 3;

  function toSaved(result: WeatherSearchResult): SavedLocation {
    return {
      id: result.id,
      name: result.name,
      region: result.region,
      country: result.country,
      lat: result.lat,
      lon: result.lon,
    };
  }

  function handleSelect(result: WeatherSearchResult) {
    const saved = toSaved(result);
    const current = loadSavedLocations();
    const existing = current.find((item) => item.id === saved.id);
    if (existing) {
      saveActiveLocationId(saved.id);
      router.push('/');
      return;
    }
    if (current.length >= 3) {
      setPending(result);
      return;
    }
    const next = [...current, saved].slice(0, 3);
    setSavedLocations(next);
    saveSavedLocations(next);
    saveActiveLocationId(saved.id);
    router.push('/');
  }

  function handleReplace(targetId: string) {
    if (!pending) return;
    const saved = toSaved(pending);
    const current = loadSavedLocations();
    const next = current.map((item) => (item.id === targetId ? saved : item));
    setSavedLocations(next);
    saveSavedLocations(next);
    saveActiveLocationId(saved.id);
    router.push('/');
  }

  const placeholder = useMemo(() => (loading ? 'Searching' : 'Search'), [loading]);

  return (
    <div className="min-h-screen bg-black px-6 py-10 text-white">
      <button
        type="button"
        onClick={() => router.push('/')}
        className="text-xs uppercase tracking-[0.3em] text-white/50"
      >
        Back
      </button>

      <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 px-4 py-3">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/30"
        />
      </div>

      <div className="mt-8 space-y-3">
        {results.map((result) => (
          <button
            key={result.id}
            type="button"
            onClick={() => handleSelect(result)}
            className="flex w-full flex-col gap-1 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left"
          >
            <span className="text-sm">{result.name}</span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-white/50">
              {result.region || result.country}
            </span>
          </button>
        ))}
        {results.length === 0 && query && !loading && (
          <div className="text-xs uppercase tracking-[0.3em] text-white/40">No results</div>
        )}
      </div>

      {limitReached && pending && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 px-6">
          <div className="w-full max-w-sm rounded-3xl bg-neutral-900 p-6 text-white">
            <div className="text-xs uppercase tracking-[0.3em] text-white/60">Limit reached</div>
            <div className="mt-4 space-y-2">
              {savedLocations.map((location) => (
                <button
                  key={location.id}
                  type="button"
                  onClick={() => handleReplace(location.id)}
                  className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left text-sm"
                >
                  <span>{location.name}</span>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-white/40">Replace</span>
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setPending(null)}
              className="mt-4 text-xs uppercase tracking-[0.3em] text-white/40"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
