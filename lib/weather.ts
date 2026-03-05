import type { DailyForecast, HourlyForecastPoint, WeatherSnapshot } from './types';
import { normalizeCondition } from './normalize';

const FORECAST_DAYS = '5';

type RawForecastDay = {
  date?: string;
  day?: {
    maxtemp_c?: number;
    maxtemp_f?: number;
    mintemp_c?: number;
    mintemp_f?: number;
    daily_chance_of_rain?: number;
    daily_chance_of_snow?: number;
    condition?: {
      text?: string;
    };
  };
  hour?: Array<{
    time?: string;
    temp_c?: number;
    temp_f?: number;
  }>;
};

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
  search.set('days', FORECAST_DAYS);

  const response = await fetch(`/api/weather/current?${search.toString()}`);
  if (!response.ok) throw new Error('Failed');

  const data = await response.json();
  const forecastDays: RawForecastDay[] = Array.isArray(data.forecast?.forecastday)
    ? data.forecast.forecastday
    : [];

  const currentTempC = toNumber(data.current?.temp_c, 0);
  const currentTempF = toNumber(data.current?.temp_f, 0);
  const forecastDay = forecastDays[0]?.day;

  const dailyForecast = toDailyForecast(forecastDays, currentTempC, currentTempF);
  const hourlyForecast = toHourlyForecast(forecastDays[0]?.hour, currentTempC, currentTempF);

  return {
    locationName: toString(data.location?.name, 'Unknown'),
    region: data.location?.region,
    country: data.location?.country,
    lat: toNumber(data.location?.lat, 0),
    lon: toNumber(data.location?.lon, 0),
    temperatureC: currentTempC,
    temperatureF: currentTempF,
    feelsLikeC: toNumber(data.current?.feelslike_c, currentTempC),
    feelsLikeF: toNumber(data.current?.feelslike_f, currentTempF),
    maxTempC: toNumber(forecastDay?.maxtemp_c, currentTempC),
    maxTempF: toNumber(forecastDay?.maxtemp_f, currentTempF),
    minTempC: toNumber(forecastDay?.mintemp_c, currentTempC),
    minTempF: toNumber(forecastDay?.mintemp_f, currentTempF),
    humidity: toNumber(data.current?.humidity, 0),
    windKph: toNumber(data.current?.wind_kph, 0),
    windMph: toNumber(data.current?.wind_mph, 0),
    precipMm: toNumber(data.current?.precip_mm, 0),
    precipIn: toNumber(data.current?.precip_in, 0),
    uv: toNumber(data.current?.uv, 0),
    visibilityKm: toNumber(data.current?.vis_km, 0),
    visibilityMiles: toNumber(data.current?.vis_miles, 0),
    conditionText: toString(data.current?.condition?.text, 'Unknown'),
    category: normalizeCondition(toString(data.current?.condition?.text, '')),
    isDay: data.current?.is_day === 1,
    updatedAt: toString(data.current?.last_updated, ''),
    dailyForecast,
    hourlyForecast,
  };
}

function toDailyForecast(forecastDays: RawForecastDay[], fallbackTempC: number, fallbackTempF: number): DailyForecast[] {
  return forecastDays.map((day) => {
    const conditionText = toString(day.day?.condition?.text, 'Unknown');
    return {
      date: toString(day.date, ''),
      maxTempC: toNumber(day.day?.maxtemp_c, fallbackTempC),
      maxTempF: toNumber(day.day?.maxtemp_f, fallbackTempF),
      minTempC: toNumber(day.day?.mintemp_c, fallbackTempC),
      minTempF: toNumber(day.day?.mintemp_f, fallbackTempF),
      chanceOfRain: toNumber(day.day?.daily_chance_of_rain, 0),
      chanceOfSnow: toNumber(day.day?.daily_chance_of_snow, 0),
      conditionText,
      category: normalizeCondition(conditionText),
    };
  });
}

function toHourlyForecast(hours: RawForecastDay['hour'], fallbackTempC: number, fallbackTempF: number): HourlyForecastPoint[] {
  return (hours ?? []).map((hour) => ({
    time: toString(hour.time, ''),
    tempC: toNumber(hour.temp_c, fallbackTempC),
    tempF: toNumber(hour.temp_f, fallbackTempF),
  }));
}

function toNumber(value: unknown, fallback: number) {
  return typeof value === 'number' ? value : fallback;
}

function toString(value: unknown, fallback: string) {
  return typeof value === 'string' ? value : fallback;
}
