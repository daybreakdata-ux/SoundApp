'use client';

import React from 'react';
import { Volume2 } from 'lucide-react';

interface VolumeControlProps {
  volume: number;
  onChange: (volume: number) => void;
}

export default function VolumeControl({ volume, onChange }: VolumeControlProps) {
  return (
    <div className="glass-card p-5 space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/15 text-accent">
            <Volume2 className="w-5 h-5" />
          </span>
          <div>
            <p className="text-sm font-semibold tracking-wide text-dark-text">Master Volume</p>
            <p className="text-xs text-dark-textMuted">Balance clarity and headroom</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-black text-accent">{volume}</div>
          <p className="text-[0.65rem] tracking-[0.3em] text-dark-textMuted uppercase">Percent</p>
        </div>
      </div>

      <div className="space-y-3">
        <input
          type="range"
          min="0"
          max="100"
          value={volume}
          onChange={(e) => onChange(Number(e.target.value))}
          className="horizontal-slider"
          style={{
            background: `linear-gradient(to right, rgba(0,168,255,0.85) ${volume}%, rgba(255,255,255,0.08) ${volume}%)`,
          }}
        />
        <div className="flex justify-between text-[0.65rem] uppercase tracking-[0.2em] text-dark-textMuted">
          <span>Silent</span>
          <span>Studio</span>
          <span>Max</span>
        </div>
      </div>
    </div>
  );
}
