import { useEffect, useState } from 'react';
import type { SavedLocation, WeatherSnapshot } from '../types';
import { fetchCurrentWeather } from '../weather';
import { getCachedWeather, setCachedWeather } from '../cache';

export function useWeatherData({
  selectedLocation,
}: {
  selectedLocation: SavedLocation | null;
}) {
  const [snapshot, setSnapshot] = useState<WeatherSnapshot | null>(null);
  const [statusText, setStatusText] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function resolveLocation(target: SavedLocation | null) {
      setStatusText(null);

      if (!target) {
        setSnapshot(null);
        setStatusText('Add location');
        return;
      }

      setLoading(true);
      await loadWeather({ id: target.id, lat: target.lat, lon: target.lon });
      if (!cancelled) setLoading(false);
    }

    async function loadWeather({ id, lat, lon }: { id: string; lat: number; lon: number }) {
      const cached = getCachedWeather(id);
      if (cached.data) {
        setSnapshot(cached.data);
      }
      if (cached.fresh) {
        return;
      }
      try {
        const data = await fetchCurrentWeather({ lat, lon });
        if (cancelled) return;
        setSnapshot(data);
        setCachedWeather(id, data);
        setStatusText(null);
      } catch {
        if (cancelled) return;
        if (cached.data) {
          setStatusText('Offline');
        } else {
          setStatusText('No data');
        }
      }
    }

    void resolveLocation(selectedLocation);

    return () => {
      cancelled = true;
    };
  }, [selectedLocation]);

  return { snapshot, statusText, loading };
}
