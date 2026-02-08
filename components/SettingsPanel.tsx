'use client';

import clsx from 'clsx';
import { Settings } from '../lib/types';

export function SettingsPanel({
  open,
  settings,
  onClose,
  onChange,
}: {
  open: boolean;
  settings: Settings;
  onClose: () => void;
  onChange: (next: Settings) => void;
}) {
  return (
    <div
      className={clsx(
        'fixed inset-0 z-50 transition-opacity',
        open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
      )}
    >
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="absolute left-1/2 top-20 w-[90%] max-w-sm -translate-x-1/2 rounded-3xl bg-neutral-900/95 p-6 text-white shadow-xl">
        <div className="text-xs uppercase tracking-[0.3em] text-white/50">Settings</div>
        <div className="mt-6 space-y-4">
          <SettingGroup
            label="Temp"
            options={['c', 'f']}
            value={settings.temperatureUnit}
            onSelect={(value) => onChange({ ...settings, temperatureUnit: value as 'c' | 'f' })}
          />
          <SettingGroup
            label="Units"
            options={['metric', 'imperial']}
            value={settings.measurementSystem}
            onSelect={(value) => onChange({ ...settings, measurementSystem: value as 'metric' | 'imperial' })}
          />
          <SettingGroup
            label="Time"
            options={['24h', '12h']}
            value={settings.timeFormat}
            onSelect={(value) => onChange({ ...settings, timeFormat: value as '24h' | '12h' })}
          />
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-[0.3em] text-white/50">Dev</span>
            <button
              type="button"
              onClick={() => onChange({ ...settings, developerMode: !settings.developerMode })}
              className={clsx(
                'rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.2em]',
                settings.developerMode ? 'bg-white text-black' : 'bg-white/10 text-white/60',
              )}
            >
              {settings.developerMode ? 'On' : 'Off'}
            </button>
          </div>
          {settings.developerMode && (
            <div className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-[0.3em] text-white/50">Temp</span>
                <input
                  type="number"
                  value={settings.developerOverrides.temperatureC}
                  onChange={(event) =>
                    onChange({
                      ...settings,
                      developerOverrides: {
                        ...settings.developerOverrides,
                        temperatureC: Number(event.target.value),
                      },
                    })
                  }
                  className="w-20 rounded-xl bg-black/40 px-3 py-1 text-right text-xs text-white"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-[0.3em] text-white/50">High</span>
                <input
                  type="number"
                  value={settings.developerOverrides.highC}
                  onChange={(event) =>
                    onChange({
                      ...settings,
                      developerOverrides: {
                        ...settings.developerOverrides,
                        highC: Number(event.target.value),
                      },
                    })
                  }
                  className="w-20 rounded-xl bg-black/40 px-3 py-1 text-right text-xs text-white"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-[0.3em] text-white/50">Low</span>
                <input
                  type="number"
                  value={settings.developerOverrides.lowC}
                  onChange={(event) =>
                    onChange({
                      ...settings,
                      developerOverrides: {
                        ...settings.developerOverrides,
                        lowC: Number(event.target.value),
                      },
                    })
                  }
                  className="w-20 rounded-xl bg-black/40 px-3 py-1 text-right text-xs text-white"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-[0.3em] text-white/50">Cond</span>
                <select
                  value={settings.developerOverrides.condition}
                  onChange={(event) =>
                    onChange({
                      ...settings,
                      developerOverrides: {
                        ...settings.developerOverrides,
                        condition: event.target.value as Settings['developerOverrides']['condition'],
                      },
                    })
                  }
                  className="rounded-xl bg-black/40 px-3 py-1 text-xs text-white"
                >
                  <option value="clear">Clear</option>
                  <option value="cloudy">Cloudy</option>
                  <option value="rain">Rain</option>
                  <option value="snow">Snow</option>
                  <option value="thunder">Thunder</option>
                  <option value="fog">Fog</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SettingGroup({
  label,
  options,
  value,
  onSelect,
}: {
  label: string;
  options: string[];
  value: string;
  onSelect: (value: string) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[10px] uppercase tracking-[0.3em] text-white/50">{label}</span>
      <div className="flex items-center gap-2">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onSelect(option)}
            className={clsx(
              'rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.2em]',
              value === option ? 'bg-white text-black' : 'bg-white/10 text-white/60',
            )}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}
