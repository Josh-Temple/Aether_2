'use client';

import type { DailyForecast, HourlyForecastPoint, Settings } from '../lib/types';

type Unit = Settings['temperatureUnit'];
type TimeFormat = Settings['timeFormat'];

export function TemperatureTrendPanel({
  points,
  temperatureUnit,
  timeFormat,
}: {
  points: HourlyForecastPoint[];
  temperatureUnit: Unit;
  timeFormat: TimeFormat;
}) {
  return (
    <div className="mt-8 w-full max-w-md">
      <div className="text-[10px] uppercase tracking-[0.35em] opacity-60">Temperature trend (24h)</div>
      <HourlyTemperatureChart points={points} temperatureUnit={temperatureUnit} timeFormat={timeFormat} />
    </div>
  );
}

export function FiveDayForecastPanel({
  dailyForecast,
  temperatureUnit,
}: {
  dailyForecast: DailyForecast[];
  temperatureUnit: Unit;
}) {
  return (
    <div className="mt-8 w-full max-w-md">
      <div className="text-[10px] uppercase tracking-[0.35em] opacity-60">5-day forecast</div>
      <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
        {dailyForecast.length ? (
          dailyForecast.map((day) => {
            const max = Math.round(temperatureUnit === 'c' ? day.maxTempC : day.maxTempF);
            const min = Math.round(temperatureUnit === 'c' ? day.minTempC : day.minTempF);
            return (
              <div
                key={`${day.date}-${day.conditionText}`}
                className="min-w-[92px] rounded-2xl bg-white/10 px-3 py-3 text-left backdrop-blur-sm"
              >
                <div className="text-[10px] uppercase tracking-[0.2em] opacity-70">{formatDayLabel(day.date)}</div>
                <div className="mt-2 text-sm font-medium">{max}° / {min}°</div>
                <div className="mt-2 text-[10px] uppercase tracking-[0.15em] opacity-70">Rain {day.chanceOfRain}%</div>
              </div>
            );
          })
        ) : (
          <div className="text-xs opacity-60">No forecast data</div>
        )}
      </div>
    </div>
  );
}

function HourlyTemperatureChart({
  points,
  temperatureUnit,
  timeFormat,
}: {
  points: HourlyForecastPoint[];
  temperatureUnit: Unit;
  timeFormat: TimeFormat;
}) {
  const limitedPoints = points.slice(0, 24);

  if (!limitedPoints.length) {
    return <div className="mt-2 text-xs opacity-60">No hourly data</div>;
  }

  const chartWidth = 320;
  const chartHeight = 96;
  const values = limitedPoints.map((point) => (temperatureUnit === 'c' ? point.tempC : point.tempF));
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const range = maxValue - minValue || 1;
  const plotted = values.map((value, index) => {
    const x = (index / Math.max(values.length - 1, 1)) * chartWidth;
    const y = chartHeight - ((value - minValue) / range) * chartHeight;
    return { x, y };
  });
  const path = plotted.map((point, index) => `${index === 0 ? 'M' : 'L'}${point.x},${point.y}`).join(' ');

  return (
    <div className="mt-2 rounded-2xl bg-white/10 px-3 py-3 backdrop-blur-sm">
      <svg
        viewBox={`0 0 ${chartWidth} ${chartHeight}`}
        className="h-24 w-full"
        role="img"
        aria-label="24 hour temperature trend"
      >
        <path d={path} fill="none" stroke="currentColor" strokeWidth="2" className="opacity-90" />
      </svg>
      <div className="mt-2 flex justify-between text-[10px] uppercase tracking-[0.1em] opacity-70">
        <span>{formatHourLabel(limitedPoints[0].time, timeFormat)}</span>
        <span>{formatHourLabel(limitedPoints[Math.floor(limitedPoints.length / 2)].time, timeFormat)}</span>
        <span>{formatHourLabel(limitedPoints[limitedPoints.length - 1].time, timeFormat)}</span>
      </div>
    </div>
  );
}

function formatDayLabel(date: string) {
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;
  return parsed.toLocaleDateString(undefined, { weekday: 'short' });
}

function formatHourLabel(dateTime: string, timeFormat: TimeFormat) {
  const parsed = new Date(dateTime);
  if (Number.isNaN(parsed.getTime())) return '--:--';
  return parsed.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: timeFormat === '12h',
  });
}
