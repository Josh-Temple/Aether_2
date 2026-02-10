'use client';

import { useMemo, useState } from 'react';
import { LocationMenu } from '../components/LocationMenu';
import { SettingsPanel } from '../components/SettingsPanel';
import { DetailsDrawer } from '../components/DetailsDrawer';
import { WeatherVisual } from '../components/WeatherVisual';
import { conditionLabel } from '../lib/normalize';
import { useSwipe } from '../lib/gestures';
import { useSettings } from '../lib/hooks/useSettings';
import { useSavedLocations } from '../lib/hooks/useSavedLocations';
import { useActiveLocation } from '../lib/hooks/useActiveLocation';
import { useWeatherData } from '../lib/hooks/useWeatherData';
import type { SavedLocation, WeatherCategory } from '../lib/types';
import { formatTemperature } from '../lib/units';

const LIGHT_THEMES: WeatherCategory[] = ['clear', 'cloudy', 'snow', 'fog'];

export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const { settings, setSettings } = useSettings();
  const { savedLocations, setSavedLocations } = useSavedLocations();
  const { selectedLocation, setSelectedLocation } = useActiveLocation(savedLocations);

  const { snapshot, statusText, loading } = useWeatherData({
    selectedLocation,
  });

  const swipeHandlers = useSwipe(
    () => setDrawerOpen(true),
    () => setDrawerOpen(false),
  );

  const activeLabel = useMemo(() => {
    if (selectedLocation) {
      return selectedLocation.name;
    }
    return 'Add location';
  }, [selectedLocation]);

  const category = snapshot?.category ?? 'cloudy';
  const isNight = snapshot ? !snapshot.isDay : false;
  const themeClass = `theme-${category}${isNight ? '-night' : ''}`;
  const temperature = formatTemperature(snapshot, settings);
  const textTone = isNight || !LIGHT_THEMES.includes(category) ? 'text-white weather-text-dark' : 'text-slate-900 weather-text-light';
  const maxTemperature = snapshot
    ? Math.round(settings.temperatureUnit === 'c' ? snapshot.maxTempC : snapshot.maxTempF)
    : null;
  const minTemperature = snapshot
    ? Math.round(settings.temperatureUnit === 'c' ? snapshot.minTempC : snapshot.minTempF)
    : null;

  function handleSelectLocation(location: SavedLocation) {
    setMenuOpen(false);
    setSelectedLocation(location);
  }

  function handleReorder(id: string, direction: 'up' | 'down') {
    setSavedLocations((prev) => {
      const index = prev.findIndex((item) => item.id === id);
      if (index < 0) return prev;
      const next = [...prev];
      const swapWith = direction === 'up' ? index - 1 : index + 1;
      if (swapWith < 0 || swapWith >= next.length) return prev;
      [next[index], next[swapWith]] = [next[swapWith], next[index]];
      return next;
    });
  }

  function handleDelete(id: string) {
    const next = savedLocations.filter((item) => item.id !== id);
    setSavedLocations(next);
    if (selectedLocation?.id === id) {
      setSelectedLocation(next[0] ?? null);
    }
  }

  return (
    <div className="app-shell flex min-h-screen flex-col">
      <LocationMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        savedLocations={savedLocations}
        selectedLocationId={selectedLocation?.id}
        onSelect={handleSelectLocation}
        onMove={handleReorder}
        onDelete={handleDelete}
        onOpenSettings={() => {
          setMenuOpen(false);
          setSettingsOpen(true);
        }}
      />
      <SettingsPanel
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        settings={settings}
        onChange={setSettings}
      />
      <DetailsDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        snapshot={snapshot}
        settings={settings}
      />

      <main className="relative flex flex-1 flex-col" {...swipeHandlers}>
        <div className={`weather-stage absolute inset-0 ${themeClass}`}>
          <WeatherVisual category={category} isNight={isNight} />
        </div>
        <div className={`relative z-10 flex flex-1 flex-col justify-between px-6 py-10 ${textTone}`}>
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="self-start text-left text-base font-medium"
          >
            {activeLabel}
          </button>
          <div className="flex flex-col items-center">
            <div className="text-6xl font-light">
              {loading && !snapshot ? <div className="skeleton h-16 w-32" /> : temperature}
            </div>
            <div className="mt-3 text-sm font-medium opacity-70">
              {snapshot ? conditionLabel(category) : '...'}
            </div>
            <div className="mt-5 flex items-center gap-4 text-xs uppercase tracking-[0.3em] opacity-70">
              <span>Max {maxTemperature ?? '--'}°</span>
              <span>Min {minTemperature ?? '--'}°</span>
            </div>
          </div>
          <div className="flex flex-col items-center gap-2">
            {statusText && (
              <div className={`text-xs uppercase tracking-[0.3em] ${textTone} opacity-60`}>{statusText}</div>
            )}
            <div className={`text-[10px] uppercase tracking-[0.4em] ${textTone} opacity-30`}>Swipe left</div>
          </div>
        </div>
      </main>
    </div>
  );
}
