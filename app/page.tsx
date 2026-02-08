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

const LIGHT_THEMES: WeatherCategory[] = ['cloudy', 'snow', 'fog'];

export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const { settings, setSettings } = useSettings();
  const { savedLocations, setSavedLocations } = useSavedLocations();
  const { selectedLocation, setSelectedLocation } = useActiveLocation(savedLocations);

  const { snapshot, statusText, loading, currentCoords } = useWeatherData({
    selectedLocation,
    savedLocations,
    onFallbackToSaved: (location) => setSelectedLocation(location),
  });

  const swipeHandlers = useSwipe(
    () => setDrawerOpen(true),
    () => setDrawerOpen(false),
  );

  const activeLabel = useMemo(() => {
    if (selectedLocation === 'current') {
      return snapshot?.locationName ? `Current · ${snapshot.locationName}` : 'Current location';
    }
    return selectedLocation.name;
  }, [selectedLocation, snapshot]);

  const category = snapshot?.category ?? 'cloudy';
  const temperature = formatTemperature(snapshot, settings);
  const textTone = LIGHT_THEMES.includes(category) ? 'text-black' : 'text-white';

  const currentIndicator = currentCoords ? `Current · ${snapshot?.locationName ?? 'Location'}` : 'Current location';

  function handleSelectLocation(location: SavedLocation | 'current') {
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

  return (
    <div className="app-shell flex min-h-screen flex-col items-center justify-between p-6">
      <LocationMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        currentLabel={currentIndicator}
        savedLocations={savedLocations}
        onSelect={handleSelectLocation}
        onMove={handleReorder}
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

      <button
        type="button"
        onClick={() => setMenuOpen(true)}
        className="mt-4 text-center text-sm text-white/80"
      >
        {activeLabel}
      </button>

      <main
        className="relative mt-10 flex w-full max-w-md flex-1 flex-col items-center justify-center"
        {...swipeHandlers}
      >
        <div className={`weather-stage h-[60vh] w-full overflow-hidden ${`theme-${category}`}`}>
          <WeatherVisual category={category} />
          <div className={`relative z-10 flex h-full flex-col items-center justify-center ${textTone}`}>
            <div className="text-[11px] uppercase tracking-[0.3em] opacity-70">
              {snapshot ? conditionLabel(category) : '...'}
            </div>
            <div className="mt-6 text-6xl font-light">
              {loading && !snapshot ? <div className="skeleton h-16 w-32" /> : temperature}
            </div>
          </div>
        </div>
        {statusText && <div className="mt-4 text-xs uppercase tracking-[0.3em] text-white/60">{statusText}</div>}
      </main>

      <div className="mb-6 text-[10px] uppercase tracking-[0.4em] text-white/30">Swipe left</div>
    </div>
  );
}
