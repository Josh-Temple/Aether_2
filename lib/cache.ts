import { loadCache, saveCache, CachedEntry } from './storage';
import { WeatherSnapshot } from './types';

const MAX_AGE_MS = 10 * 60 * 1000;

export function getCachedWeather(id: string): { data: WeatherSnapshot | null; fresh: boolean } {
  const cache = loadCache();
  const entry = cache.find((item) => item.id === id);
  if (!entry) return { data: null, fresh: false };
  const age = Date.now() - entry.timestamp;
  return { data: entry.data as WeatherSnapshot, fresh: age < MAX_AGE_MS };
}

export function setCachedWeather(id: string, data: WeatherSnapshot): void {
  const cache = loadCache();
  const next: CachedEntry = { id, data, timestamp: Date.now() };
  const filtered = cache.filter((item) => item.id !== id);
  saveCache([next, ...filtered].slice(0, 10));
}
