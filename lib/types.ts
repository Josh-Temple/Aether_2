export type WeatherCategory =
  | 'clear'
  | 'cloudy'
  | 'rain'
  | 'snow'
  | 'thunder'
  | 'fog';

export type WeatherSnapshot = {
  locationName: string;
  region?: string;
  country?: string;
  lat: number;
  lon: number;
  temperatureC: number;
  temperatureF: number;
  feelsLikeC: number;
  feelsLikeF: number;
  humidity: number;
  windKph: number;
  windMph: number;
  precipMm: number;
  precipIn: number;
  uv: number;
  visibilityKm: number;
  visibilityMiles: number;
  conditionText: string;
  category: WeatherCategory;
  updatedAt: string;
};

export type SavedLocation = {
  id: string;
  name: string;
  region?: string;
  country?: string;
  lat: number;
  lon: number;
};
export type Settings = {
  temperatureUnit: 'c' | 'f';
  measurementSystem: 'metric' | 'imperial';
  timeFormat: '24h' | '12h';
};
