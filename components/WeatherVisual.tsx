'use client';

import type { CSSProperties } from 'react';
import { WeatherCategory } from '../lib/types';

const layers: Record<WeatherCategory, Array<{ className: string; style: CSSProperties }>> = {
  clear: [
    { className: 'visual-layer', style: { width: '220px', height: '220px', top: '15%', left: '20%', opacity: 0.7 } },
    { className: 'visual-layer', style: { width: '180px', height: '180px', top: '40%', left: '55%', opacity: 0.4 } },
  ],
  cloudy: [
    { className: 'visual-layer', style: { width: '260px', height: '120px', top: '25%', left: '10%' } },
    { className: 'visual-layer', style: { width: '240px', height: '140px', top: '40%', left: '40%', opacity: 0.6 } },
    { className: 'visual-layer', style: { width: '200px', height: '110px', top: '55%', left: '15%', opacity: 0.45 } },
  ],
  rain: [
    { className: 'visual-layer', style: { width: '240px', height: '140px', top: '20%', left: '20%' } },
    { className: 'visual-layer', style: { width: '200px', height: '120px', top: '45%', left: '50%', opacity: 0.4 } },
  ],
  snow: [
    { className: 'visual-layer', style: { width: '220px', height: '130px', top: '20%', left: '20%' } },
    { className: 'visual-layer', style: { width: '200px', height: '120px', top: '50%', left: '50%', opacity: 0.5 } },
  ],
  thunder: [
    { className: 'visual-layer', style: { width: '240px', height: '140px', top: '15%', left: '20%', opacity: 0.6 } },
    { className: 'visual-layer', style: { width: '140px', height: '300px', top: '35%', left: '60%', opacity: 0.3 } },
  ],
  fog: [
    { className: 'visual-layer', style: { width: '260px', height: '120px', top: '25%', left: '15%', opacity: 0.35 } },
    { className: 'visual-layer', style: { width: '280px', height: '110px', top: '50%', left: '5%', opacity: 0.3 } },
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
