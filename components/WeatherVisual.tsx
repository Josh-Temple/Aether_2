'use client';

import type { CSSProperties } from 'react';
import { WeatherCategory } from '../lib/types';

const layers: Record<WeatherCategory, Array<{ className: string; style: CSSProperties }>> = {
  clear: [
    {
      className: 'visual-ring',
      style: { width: '200px', height: '200px', top: '18%', left: '50%', transform: 'translateX(-50%)' },
    },
  ],
  cloudy: [
    { className: 'visual-layer', style: { width: '240px', height: '140px', top: '28%', left: '15%' } },
    { className: 'visual-layer', style: { width: '220px', height: '120px', top: '46%', left: '45%', opacity: 0.45 } },
  ],
  rain: [
    { className: 'visual-layer', style: { width: '260px', height: '120px', top: '22%', left: '15%', opacity: 0.35 } },
    { className: 'rain-streak', style: { height: '120px', top: '35%', left: '48%' } },
    { className: 'rain-streak', style: { height: '140px', top: '38%', left: '55%', opacity: 0.5 } },
    { className: 'rain-streak', style: { height: '110px', top: '40%', left: '62%', opacity: 0.4 } },
  ],
  snow: [
    { className: 'visual-layer', style: { width: '220px', height: '120px', top: '24%', left: '20%', opacity: 0.4 } },
    { className: 'visual-layer', style: { width: '200px', height: '110px', top: '52%', left: '55%', opacity: 0.35 } },
  ],
  thunder: [
    { className: 'visual-layer', style: { width: '240px', height: '120px', top: '18%', left: '20%', opacity: 0.35 } },
    { className: 'visual-layer', style: { width: '140px', height: '280px', top: '40%', left: '60%', opacity: 0.25 } },
  ],
  fog: [
    { className: 'visual-layer', style: { width: '260px', height: '120px', top: '30%', left: '10%', opacity: 0.3 } },
    { className: 'visual-layer', style: { width: '280px', height: '110px', top: '52%', left: '5%', opacity: 0.25 } },
  ],
};

export function WeatherVisual({ category }: { category: WeatherCategory }) {
  return (
    <div className="weather-visual">
      {layers[category].map((layer, index) => (
        <div key={index} className={layer.className} style={layer.style} />
      ))}
    </div>
  );
}
