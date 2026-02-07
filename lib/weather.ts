import { WeatherSnapshot } from './types';
import { normalizeCondition } from './normalize';

export type WeatherSearchResult = {
  id: string;
  name: string;
  region: string;
  country: string;
  lat: number;
  lon: number;
};

export async function searchLocations(query: string): Promise<WeatherSearchResult[]> {
  if (!query) return [];
  const response = await fetch(`/api/weather/search?q=${encodeURIComponent(query)}`);
  if (!response.ok) return [];
  return response.json();
}

export async function fetchCurrentWeather(params: {
  q?: string;
  lat?: number;
  lon?: number;
}): Promise<WeatherSnapshot> {
  const search = new URLSearchParams();
  if (params.q) search.set('q', params.q);
  if (params.lat !== undefined && params.lon !== undefined) {
    search.set('lat', String(params.lat));
    search.set('lon', String(params.lon));
  }
  const response = await fetch(`/api/weather/current?${search.toString()}`);
  if (!response.ok) {
    throw new Error('Failed');
  }
  const data = await response.json();
  return {
    locationName: data.location.name,
    region: data.location.region,
    country: data.location.country,
    lat: data.location.lat,
    lon: data.location.lon,
    temperatureC: data.current.temp_c,
    temperatureF: data.current.temp_f,
    feelsLikeC: data.current.feelslike_c,
    feelsLikeF: data.current.feelslike_f,
    humidity: data.current.humidity,
    windKph: data.current.wind_kph,
    windMph: data.current.wind_mph,
    precipMm: data.current.precip_mm,
    precipIn: data.current.precip_in,
    uv: data.current.uv,
    visibilityKm: data.current.vis_km,
    visibilityMiles: data.current.vis_miles,
    conditionText: data.current.condition.text,
    category: normalizeCondition(data.current.condition.text),
    updatedAt: data.current.last_updated,
  } as WeatherSnapshot;
}
