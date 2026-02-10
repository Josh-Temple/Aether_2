import { useEffect, useState } from 'react';
import type { SavedLocation } from '../types';
import { loadActiveLocationId, saveActiveLocationId } from '../storage';

export function useActiveLocation(savedLocations: SavedLocation[]) {
  const [selectedLocation, setSelectedLocation] = useState<SavedLocation | null>(null);

  useEffect(() => {
    const activeId = loadActiveLocationId();
    if (activeId) {
      const match = savedLocations.find((item) => item.id === activeId);
      if (match) {
        setSelectedLocation(match);
        return;
      }
    }
    setSelectedLocation(savedLocations[0] ?? null);
  }, [savedLocations]);

  useEffect(() => {
    if (selectedLocation) {
      saveActiveLocationId(selectedLocation.id);
    } else {
      saveActiveLocationId(null);
    }
  }, [selectedLocation]);

  return { selectedLocation, setSelectedLocation };
}
