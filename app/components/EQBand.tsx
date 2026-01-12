'use client';

import React from 'react';

interface EQBandProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
}

export default function EQBand({ label, value, onChange }: EQBandProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      {/* Frequency Label */}
      <div className="text-xs font-medium text-dark-textMuted">{label}</div>
      {/* Slider Control */}
      <div className="eq-slider-wrapper">
        <input
          type="range"
          min="-12"
          max="12"
          step="1"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="eq-vertical-slider"
          aria-label={`${label} gain`}
        />
      </div>
      
      {/* Value Display */}
      <div
        className={`text-xs font-bold ${
          value > 0 ? 'text-accent' : value < 0 ? 'text-warning' : 'text-dark-textMuted'
        }`}
      >
        {value > 0 ? '+' : ''}{value}
      </div>
    </div>
  );
}
