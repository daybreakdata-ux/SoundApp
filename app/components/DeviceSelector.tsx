'use client';

import React from 'react';
import { Mic, Speaker, ChevronDown } from 'lucide-react';

interface Device {
  deviceId: string;
  label: string;
}

interface DeviceSelectorProps {
  label: string;
  devices: Device[];
  selectedDevice: string;
  onChange: (deviceId: string) => void;
  disabled?: boolean;
}

export default function DeviceSelector({
  label,
  devices,
  selectedDevice,
  onChange,
  disabled = false,
}: DeviceSelectorProps) {
  const Icon = label.includes('Input') ? Mic : Speaker;

  return (
    <div className="glass-card p-5 space-y-4">
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-3 text-sm font-semibold tracking-wide text-dark-text">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/15 text-accent">
            <Icon className="w-4 h-4" />
          </span>
          {label}
        </label>
        {disabled ? (
          <span className="status-pill bg-warning/20 border-warning/40 text-warning">Locked</span>
        ) : (
          <span className="text-[0.7rem] uppercase tracking-[0.2em] text-dark-textMuted">
            Available
          </span>
        )}
      </div>

      <div className="relative">
        <select
          value={selectedDevice}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className="
            w-full appearance-none rounded-xl border border-white/5
            bg-gradient-to-r from-white/4 to-white/2
            px-4 py-3 pr-12 text-sm font-medium text-dark-text
            shadow-inner shadow-black/20 transition-all
            focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/40
            disabled:opacity-60 disabled:cursor-not-allowed
          "
        >
          <option value="default">Default Device</option>
          {devices.map((device) => (
            <option key={device.deviceId} value={device.deviceId}>
              {device.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-accent/80" />
      </div>
    </div>
  );
}
