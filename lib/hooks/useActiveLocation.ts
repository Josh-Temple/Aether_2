import { useEffect, useState } from 'react';
import type { SavedLocation } from '../types';
import { loadActiveLocationId, saveActiveLocationId } from '../storage';

export function useActiveLocation(savedLocations: SavedLocation[]) {
  const [selectedLocation, setSelectedLocation] = useState<SavedLocation | 'current'>('current');

  useEffect(() => {
    const activeId = loadActiveLocationId();
    if (activeId) {
      const match = savedLocations.find((item) => item.id === activeId);
      if (match) {
        setSelectedLocation(match);
      }
    }
  }, [savedLocations]);

  useEffect(() => {
    if (selectedLocation === 'current') {
      saveActiveLocationId(null);
    } else {
      saveActiveLocationId(selectedLocation.id);
    }
  }, [selectedLocation]);

  return { selectedLocation, setSelectedLocation };
}
