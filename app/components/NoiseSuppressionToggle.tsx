'use client';

import React from 'react';
import { Waves } from 'lucide-react';

interface NoiseSuppressionToggleProps {
  enabled: boolean;
  onChange: () => void;
  disabled?: boolean;
}

export default function NoiseSuppressionToggle({
  enabled,
  onChange,
  disabled = false,
}: NoiseSuppressionToggleProps) {
  return (
    <div className="glass-card flex flex-col gap-5 p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/15 text-accent">
            <Waves className="w-5 h-5" />
          </span>
          <div>
            <h3 className="text-sm font-semibold tracking-wide text-dark-text">
              Noise Suppression
            </h3>
            <p className="text-xs text-dark-textMuted">
              Adaptive filtering for cleaner playback
            </p>
          </div>
        </div>
        <span className={`status-pill ${enabled ? 'bg-accent/20 border-accent/40 text-accent' : 'bg-white/10 border-white/20 text-dark-textMuted'}`}>
          {enabled ? 'Engaged' : 'Bypassed'}
        </span>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-xs text-dark-textMuted">
          {enabled
            ? 'Background noise reduction is active.'
            : 'Enable to reduce ambient noise in the signal.'}
        </p>
        <button
          onClick={onChange}
          disabled={disabled}
          className={`
            relative inline-flex h-9 w-16 items-center rounded-full
            transition-all duration-300
            focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-black/40
            disabled:opacity-40 disabled:cursor-not-allowed
            ${enabled ? 'bg-accent shadow-lg shadow-accent/25' : 'bg-white/10'}
          `}
        >
          <span
            className={`
              inline-block h-7 w-7 transform rounded-full bg-white shadow
              transition-transform duration-300
              ${enabled ? 'translate-x-7' : 'translate-x-1'}
            `}
          />
        </button>
      </div>

      {disabled && (
        <div className="rounded-lg border border-warning/40 bg-warning/10 px-3 py-2 text-xs text-warning">
          Stop audio to adjust noise suppression settings.
        </div>
      )}
    </div>
  );
}
