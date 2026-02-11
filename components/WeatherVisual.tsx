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

const rainDropLayers: Array<{ style: CSSProperties }> = [
  { style: { height: '130px', top: '30%', left: '42%', animationDelay: '0s' } },
  { style: { height: '120px', top: '34%', left: '48%', opacity: 0.5, animationDelay: '0.45s' } },
  { style: { height: '145px', top: '32%', left: '54%', opacity: 0.42, animationDelay: '1.1s' } },
  { style: { height: '110px', top: '38%', left: '60%', opacity: 0.38, animationDelay: '0.75s' } },
  { style: { height: '115px', top: '35%', left: '66%', opacity: 0.32, animationDelay: '1.55s' } },
  { style: { height: '105px', top: '42%', left: '72%', opacity: 0.3, animationDelay: '1.9s' } },
];

const snowFlakeLayers: Array<{ style: CSSProperties }> = [
  { style: { width: '4px', height: '4px', top: '22%', left: '22%', animationDelay: '0s' } },
  { style: { width: '3px', height: '3px', top: '16%', left: '34%', animationDelay: '0.9s' } },
  { style: { width: '5px', height: '5px', top: '20%', left: '44%', animationDelay: '1.5s' } },
  { style: { width: '4px', height: '4px', top: '28%', left: '56%', animationDelay: '2.1s' } },
  { style: { width: '3px', height: '3px', top: '24%', left: '66%', animationDelay: '2.8s' } },
  { style: { width: '4px', height: '4px', top: '18%', left: '76%', animationDelay: '3.4s' } },
];

const fogBands: Array<{ style: CSSProperties }> = [
  { style: { width: '90%', height: '34px', top: '34%', left: '-15%', animationDelay: '0s' } },
  { style: { width: '85%', height: '30px', top: '48%', left: '-20%', opacity: 0.22, animationDelay: '2.2s' } },
  { style: { width: '75%', height: '26px', top: '62%', left: '-12%', opacity: 0.18, animationDelay: '4s' } },
];

export function WeatherVisual({ category, isNight }: { category: WeatherCategory; isNight: boolean }) {
  const showStars = isNight && category === 'clear';
  const showLightning = category === 'thunder';
  const showRain = category === 'rain' || category === 'thunder';
  const showSnow = category === 'snow';
  const showFog = category === 'fog';
  const showCloudDrift = category === 'cloudy' || category === 'rain' || category === 'thunder';

  return (
    <div className="weather-visual">
      {layers[category].map((layer, index) => {
        const hideClearRingAtNight = category === 'clear' && isNight && layer.className === 'visual-ring';
        if (hideClearRingAtNight) return null;
        return (
          <div
            key={index}
            className={`${layer.className}${showCloudDrift && layer.className === 'visual-layer' ? ' cloud-drift' : ''}`}
            style={layer.style}
          />
        );
      })}
      {showRain && rainDropLayers.map((drop, index) => <div key={`rain-${index}`} className="rain-streak" style={drop.style} />)}
      {showSnow && snowFlakeLayers.map((flake, index) => <div key={`snow-${index}`} className="snow-flake" style={flake.style} />)}
      {showFog && fogBands.map((band, index) => <div key={`fog-${index}`} className="fog-band" style={band.style} />)}
      {showStars &&
        starLayers.map((star, index) => <div key={`star-${index}`} className="night-star" style={star.style} />)}
      {showLightning && <div className="lightning-flash" />}
      <div className="ambient-glow" />
    </div>
  );
}
