import { useEffect, useState } from 'react';
import type { Settings } from '../types';
import { loadSettings, saveSettings } from '../storage';

const DEFAULT_SETTINGS: Settings = {
  temperatureUnit: 'c',
  measurementSystem: 'metric',
  timeFormat: '24h',
};

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);

  useEffect(() => {
    setSettings(loadSettings());
  }, []);

  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  return { settings, setSettings };
}
