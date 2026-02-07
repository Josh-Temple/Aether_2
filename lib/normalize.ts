import { WeatherCategory } from './types';

const CATEGORY_MAP: Array<[RegExp, WeatherCategory]> = [
  [/thunder|storm|lightning/i, 'thunder'],
  [/snow|sleet|ice|blizzard/i, 'snow'],
  [/fog|mist|haze/i, 'fog'],
  [/rain|drizzle|shower/i, 'rain'],
  [/cloud|overcast/i, 'cloudy'],
  [/sun|clear/i, 'clear'],
];

export function normalizeCondition(text: string): WeatherCategory {
  const entry = CATEGORY_MAP.find(([regex]) => regex.test(text));
  return entry ? entry[1] : 'clear';
}

export function conditionLabel(category: WeatherCategory): string {
  switch (category) {
    case 'clear':
      return 'Clear';
    case 'cloudy':
      return 'Cloudy';
    case 'rain':
      return 'Rain';
    case 'snow':
      return 'Snow';
    case 'thunder':
      return 'Storm';
    case 'fog':
      return 'Fog';
  }
}
