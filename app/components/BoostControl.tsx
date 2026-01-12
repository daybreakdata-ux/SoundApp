'use client';

import React from 'react';
import { TrendingUp } from 'lucide-react';

interface BoostControlProps {
  boostLevel: number;
  onChange: (boost: number) => void;
}

export default function BoostControl({ boostLevel, onChange }: BoostControlProps) {
  return (
    <div className="glass-card p-5 space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-warning/15 text-warning">
            <TrendingUp className="w-5 h-5" />
          </span>
          <div>
            <p className="text-sm font-semibold tracking-wide text-dark-text">Boost Level</p>
            <p className="text-xs text-dark-textMuted">Lift quiet signals with care</p>
          </div>
        </div>
        <div className="text-right">
          <div className={`text-2xl font-black ${boostLevel > 15 ? 'text-warning' : 'text-accent'}`}>
            {boostLevel > 0 ? '+' : ''}
            {boostLevel.toFixed(1)}
          </div>
          <p className="text-[0.65rem] tracking-[0.3em] text-dark-textMuted uppercase">dB Gain</p>
        </div>
      </div>

      <div className="space-y-3">
        <input
          type="range"
          min="0"
          max="20"
          step="0.5"
          value={boostLevel}
          onChange={(e) => onChange(Number(e.target.value))}
          className="horizontal-slider"
          style={{
            background: `linear-gradient(to right, rgba(255,107,53,0.9) ${(boostLevel / 20) * 100}%, rgba(255,255,255,0.08) ${(boostLevel / 20) * 100}%)`,
          }}
        />
        <div className="flex justify-between text-[0.65rem] uppercase tracking-[0.2em] text-dark-textMuted">
          <span>Clean</span>
          <span>Lift</span>
          <span>Extreme</span>
        </div>
      </div>

      {boostLevel > 15 && (
        <div className="flex items-center gap-2 rounded-lg border border-warning/40 bg-warning/10 px-3 py-2 text-xs text-warning/90">
          <span className="text-warning">⚠</span>
          High boost levels may introduce distortion.
        </div>
      )}
    </div>
  );
}
