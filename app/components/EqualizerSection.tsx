'use client';

import React from 'react';
import { Sliders, BarChart3 } from 'lucide-react';
import EQBand from './EQBand';

interface EqualizerSectionProps {
  eqBands: number[];
  onBandChange: (index: number, value: number) => void;
  bandConfigs: Array<{ freq: number; type: string }>;
}

export default function EqualizerSection({
  eqBands,
  onBandChange,
  bandConfigs,
}: EqualizerSectionProps) {
  const formatFrequency = (freq: number) => {
    if (freq >= 1000) {
      return `${(freq / 1000).toFixed(freq % 1000 === 0 ? 0 : 1)}k`;
    }
    return freq.toString();
  };

  return (
    <div className="glass-panel p-7 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-accent/15 text-accent">
            <Sliders className="w-5 h-5" />
          </span>
          <div>
            <h2 className="text-xl font-semibold text-white">8-Band Parametric Equalizer</h2>
            <p className="text-xs text-dark-textMuted">
              Sculpt the signal with surgical precision
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-dark-textMuted">
          <BarChart3 className="h-4 w-4 text-accent" />
          Live response
        </div>
      </div>

      {/* Graphic EQ Display */}
      <div className="rounded-2xl border border-white/5 bg-gradient-to-br from-white/6 via-white/2 to-white/4 p-5 shadow-inner shadow-black/30">
        <div className="mb-3 flex items-center justify-between text-[0.65rem] uppercase tracking-[0.3em] text-dark-textMuted">
          <span>Low</span>
          <span>Mid</span>
          <span>High</span>
        </div>
        <div className="relative h-28">
          <div className="absolute inset-0">
            <div className="grid h-full grid-rows-4 gap-3 text-white/5">
              <span className="block h-px bg-white/10"></span>
              <span className="block h-px bg-white/10"></span>
              <span className="block h-px bg-white/10"></span>
              <span className="block h-px bg-white/10"></span>
            </div>
          </div>
          <div className="relative z-10 flex h-full items-end justify-between gap-2">
            {eqBands.map((value, index) => {
              const height = ((value + 12) / 24) * 100;
              const color = value > 0 ? '#00a8ff' : value < 0 ? '#ff6b35' : '#3b3d55';

              return (
                <div key={index} className="flex flex-1 flex-col items-center">
                  <div className="flex h-full w-full items-end justify-center">
                    <div
                      className="w-3/4 rounded-t-xl transition-all duration-300 ease-out"
                      style={{
                        height: `${height}%`,
                        background: `linear-gradient(180deg, ${color}cc 0%, ${color} 65%)`,
                        boxShadow: value !== 0 ? `0 10px 25px ${color}33` : 'none',
                      }}
                    />
                  </div>
                  <span className="mt-2 text-[0.65rem] text-dark-textMuted">
                    {formatFrequency(bandConfigs[index].freq)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* EQ Band Controls */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-8">
        {eqBands.map((value, index) => (
          <EQBand
            key={index}
            label={formatFrequency(bandConfigs[index].freq)}
            value={value}
            onChange={(newValue) => onBandChange(index, newValue)}
          />
        ))}
      </div>

      {/* Controls */}
      <div className="flex flex-wrap justify-center gap-3">
        <PresetButton
          label="Reset EQ"
          description="Return to flat response"
          onClick={() => {
            eqBands.forEach((_, index) => onBandChange(index, 0));
          }}
        />
        <PresetButton
          label="Bass Boost"
          description="Warm low-end emphasis"
          onClick={() => {
            const preset = [8, 6, 3, 0, 0, 0, 0, 0];
            preset.forEach((val, index) => onBandChange(index, val));
          }}
        />
        <PresetButton
          label="Treble Boost"
          description="Airy high-frequency lift"
          onClick={() => {
            const preset = [0, 0, 0, 0, 3, 6, 8, 6];
            preset.forEach((val, index) => onBandChange(index, val));
          }}
        />
      </div>
    </div>
  );
}

interface PresetButtonProps {
  label: string;
  description: string;
  onClick: () => void;
}

function PresetButton({ label, description, onClick }: PresetButtonProps) {
  return (
    <button
      onClick={onClick}
      className="
        group flex flex-col items-start gap-1 rounded-xl border border-white/10
        bg-white/5 px-4 py-3 text-left text-sm text-dark-text transition
        hover:border-accent/40 hover:bg-accent/10 hover:text-white
      "
    >
      <span className="font-semibold">{label}</span>
      <span className="text-[0.7rem] text-dark-textMuted group-hover:text-white/80">{description}</span>
    </button>
  );
}
