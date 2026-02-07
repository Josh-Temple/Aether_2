import { useEffect, useState } from 'react';
import type { SavedLocation, WeatherSnapshot } from '../types';
import { fetchCurrentWeather } from '../weather';
import { getCachedWeather, setCachedWeather } from '../cache';

export function useWeatherData({
  selectedLocation,
  savedLocations,
  onFallbackToSaved,
}: {
  selectedLocation: SavedLocation | 'current';
  savedLocations: SavedLocation[];
  onFallbackToSaved: (location: SavedLocation) => void;
}) {
  const [snapshot, setSnapshot] = useState<WeatherSnapshot | null>(null);
  const [statusText, setStatusText] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentCoords, setCurrentCoords] = useState<{ lat: number; lon: number } | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function resolveLocation(target: SavedLocation | 'current') {
      setStatusText(null);
      if (target === 'current') {
        if (!navigator.geolocation) {
          setStatusText('No data');
          return;
        }
        setLoading(true);
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            if (cancelled) return;
            const coords = { lat: position.coords.latitude, lon: position.coords.longitude };
            setCurrentCoords(coords);
            await loadWeather({ id: 'current', ...coords });
            if (!cancelled) setLoading(false);
          },
          () => {
            if (cancelled) return;
            setLoading(false);
            if (savedLocations.length === 0) {
              setStatusText('Add location');
            } else {
              onFallbackToSaved(savedLocations[0]);
            }
          },
        );
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
  }, [selectedLocation, savedLocations, onFallbackToSaved]);

  return { snapshot, statusText, loading, currentCoords };
}
