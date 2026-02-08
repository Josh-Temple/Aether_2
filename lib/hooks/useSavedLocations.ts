import { useEffect, useState } from 'react';
import type { SavedLocation } from '../types';
import { loadSavedLocations, saveSavedLocations } from '../storage';

export function useSavedLocations() {
  const [savedLocations, setSavedLocations] = useState<SavedLocation[]>([]);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    setSavedLocations(loadSavedLocations());
    setHasLoaded(true);
  }, []);

  useEffect(() => {
    if (!hasLoaded) return;
    saveSavedLocations(savedLocations);
  }, [savedLocations, hasLoaded]);

  return { savedLocations, setSavedLocations };
}
