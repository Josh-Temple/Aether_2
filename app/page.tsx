'use client';

import { useMemo, useState } from 'react';
import { LocationMenu } from '../components/LocationMenu';
import { SettingsPanel } from '../components/SettingsPanel';
import { DetailsDrawer } from '../components/DetailsDrawer';
import { WeatherVisual } from '../components/WeatherVisual';
import { FiveDayForecastPanel, TemperatureTrendPanel } from '../components/ForecastPanels';
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
  const dailyForecast = snapshot?.dailyForecast ?? [];
  const hourlyForecast = snapshot?.hourlyForecast ?? [];
  const supportLine = useMemo(() => {
    const trendPoints = snapshot?.hourlyForecast ?? [];
    if (!snapshot || trendPoints.length < 8) return null;
    const firstPoint = trendPoints[0];
    const laterPoint = trendPoints[Math.min(8, trendPoints.length - 1)];
    const firstTemp = settings.temperatureUnit === 'c' ? firstPoint.tempC : firstPoint.tempF;
    const laterTemp = settings.temperatureUnit === 'c' ? laterPoint.tempC : laterPoint.tempF;
    const diff = laterTemp - firstTemp;

    if (diff >= 2) return 'Warmer into the afternoon';
    if (diff <= -2) return 'Cooler later today';
    return 'Stable through the day';
  }, [settings.temperatureUnit, snapshot]);

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
        <div className={`relative z-10 flex flex-1 flex-col justify-between px-6 py-8 ${textTone}`}>
          <div className="flex items-start justify-between">
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="text-left text-base font-medium opacity-95"
            >
              {activeLabel}
            </button>
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              aria-label="Open weather details"
              className="details-trigger"
            >
              <span className="text-[10px] uppercase tracking-[0.18em] opacity-75">Details</span>
              <span aria-hidden="true" className="text-base leading-none opacity-85">›</span>
            </button>
          </div>
          <div className="-mt-2 flex flex-col items-center">
            <div className="text-6xl font-light">
              {loading && !snapshot ? <div className="skeleton h-16 w-32" /> : temperature}
            </div>
            <div className="mt-3 text-sm font-medium opacity-80">
              {snapshot ? conditionLabel(category) : '...'}
            </div>
            {supportLine && <div className="mt-2 text-[11px] uppercase tracking-[0.16em] opacity-65">{supportLine}</div>}
            <div className="mt-4 flex items-center gap-4 text-xs uppercase tracking-[0.28em] opacity-80">
              <span>Max {maxTemperature ?? '--'}°</span>
              <span>Min {minTemperature ?? '--'}°</span>
            </div>

            <TemperatureTrendPanel
              points={hourlyForecast}
              temperatureUnit={settings.temperatureUnit}
              timeFormat={settings.timeFormat}
            />

            <FiveDayForecastPanel
              dailyForecast={dailyForecast}
              temperatureUnit={settings.temperatureUnit}
            />
          </div>
          <div className="flex flex-col items-center gap-2">
            {statusText && (
              <div className={`text-xs uppercase tracking-[0.26em] ${textTone} opacity-70`}>{statusText}</div>
            )}
            <div className={`text-[10px] uppercase tracking-[0.32em] ${textTone} opacity-55`}>Swipe left for details</div>
          </div>
        </div>
      </main>
    </div>
  );
}
