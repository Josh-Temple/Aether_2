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

const starLayers: Array<{ style: CSSProperties }> = [
  { style: { width: '2px', height: '2px', top: '18%', left: '22%', animationDelay: '0s' } },
  { style: { width: '2px', height: '2px', top: '14%', left: '38%', animationDelay: '1.2s' } },
  { style: { width: '3px', height: '3px', top: '22%', left: '52%', animationDelay: '2.4s' } },
  { style: { width: '2px', height: '2px', top: '28%', left: '68%', animationDelay: '0.8s' } },
  { style: { width: '2px', height: '2px', top: '34%', left: '80%', animationDelay: '1.7s' } },
  { style: { width: '3px', height: '3px', top: '10%', left: '74%', animationDelay: '2.9s' } },
  { style: { width: '2px', height: '2px', top: '26%', left: '12%', animationDelay: '3.1s' } },
  { style: { width: '2px', height: '2px', top: '30%', left: '42%', animationDelay: '1.9s' } },
];

export function WeatherVisual({ category, isNight }: { category: WeatherCategory; isNight: boolean }) {
  const showStars = isNight && category === 'clear';
  const showLightning = isNight && category === 'thunder';

  return (
    <div className="weather-visual">
      {layers[category].map((layer, index) => {
        const hideClearRingAtNight = category === 'clear' && isNight && layer.className === 'visual-ring';
        if (hideClearRingAtNight) return null;
        return <div key={index} className={layer.className} style={layer.style} />;
      })}
      {showStars &&
        starLayers.map((star, index) => <div key={`star-${index}`} className="night-star" style={star.style} />)}
      {showLightning && <div className="lightning-flash" />}
    </div>
  );
}
