import { SavedLocation, Settings } from './types';

const LOCATIONS_KEY = 'aether_saved_locations';
const SETTINGS_KEY = 'aether_settings';
const CACHE_KEY = 'aether_weather_cache';
const ACTIVE_LOCATION_KEY = 'aether_active_location';

export type CachedEntry = {
  id: string;
  data: unknown;
  timestamp: number;
};

export function loadSavedLocations(): SavedLocation[] {
  if (typeof window === 'undefined') return [];
  const raw = window.localStorage.getItem(LOCATIONS_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as SavedLocation[];
  } catch {
    return [];
  }
}

export function saveSavedLocations(locations: SavedLocation[]): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(LOCATIONS_KEY, JSON.stringify(locations.slice(0, 3)));
}

export function loadSettings(): Settings {
  const defaults: Settings = {
    temperatureUnit: 'c',
    measurementSystem: 'metric',
    timeFormat: '24h',
    developerMode: false,
    developerOverrides: { temperatureC: 22, highC: 26, lowC: 18, condition: 'clear' },
  };
  if (typeof window === 'undefined') {
    return defaults;
  }
  const raw = window.localStorage.getItem(SETTINGS_KEY);
  if (!raw) {
    return defaults;
  }
  try {
    const parsed = JSON.parse(raw) as Partial<Settings>;
    return {
      ...defaults,
      ...parsed,
      developerOverrides: {
        ...defaults.developerOverrides,
        ...parsed.developerOverrides,
      },
    };
  } catch {
    return defaults;
  }
}

export function saveSettings(settings: Settings): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export function loadCache(): CachedEntry[] {
  if (typeof window === 'undefined') return [];
  const raw = window.localStorage.getItem(CACHE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as CachedEntry[];
  } catch {
    return [];
  }
}

export function saveCache(cache: CachedEntry[]): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
}

export function loadActiveLocationId(): string | null {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(ACTIVE_LOCATION_KEY);
}

export function saveActiveLocationId(id: string | null): void {
  if (typeof window === 'undefined') return;
  if (id) {
    window.localStorage.setItem(ACTIVE_LOCATION_KEY, id);
  } else {
    window.localStorage.removeItem(ACTIVE_LOCATION_KEY);
  }
}
