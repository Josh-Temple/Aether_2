import { Settings, WeatherSnapshot } from './types';

export function formatTemperature(snapshot: WeatherSnapshot | null, settings: Settings): string {
  if (!snapshot) return '--';
  const value = settings.temperatureUnit === 'c' ? snapshot.temperatureC : snapshot.temperatureF;
  return `${Math.round(value)}°`;
}

export function detailValue(
  snapshot: WeatherSnapshot,
  settings: Settings,
  type: 'wind' | 'feels' | 'rain' | 'vis',
): string {
  switch (type) {
    case 'wind':
      return settings.measurementSystem === 'metric'
        ? `${Math.round(snapshot.windKph)}kph`
        : `${Math.round(snapshot.windMph)}mph`;
    case 'feels':
      return settings.temperatureUnit === 'c'
        ? `${Math.round(snapshot.feelsLikeC)}°`
        : `${Math.round(snapshot.feelsLikeF)}°`;
    case 'rain':
      return settings.measurementSystem === 'metric'
        ? `${snapshot.precipMm.toFixed(1)}mm`
        : `${snapshot.precipIn.toFixed(2)}in`;
    case 'vis':
      return settings.measurementSystem === 'metric'
        ? `${snapshot.visibilityKm.toFixed(1)}km`
        : `${snapshot.visibilityMiles.toFixed(1)}mi`;
  }
}
