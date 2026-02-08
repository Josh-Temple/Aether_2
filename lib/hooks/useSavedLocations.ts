import { useEffect, useState } from 'react';
import type { SavedLocation } from '../types';
import { loadSavedLocations, saveSavedLocations } from '../storage';

export function useSavedLocations() {
  const [savedLocations, setSavedLocations] = useState<SavedLocation[]>([]);

  useEffect(() => {
    setSavedLocations(loadSavedLocations());
  }, []);

  useEffect(() => {
    saveSavedLocations(savedLocations);
  }, [savedLocations]);

  return { savedLocations, setSavedLocations };
}
