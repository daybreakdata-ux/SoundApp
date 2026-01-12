'use client';

import React from 'react';
import { useAudioBooster } from '@/app/hooks/useAudioBooster';
import { Volume2, Power, PowerOff, Activity, ShieldCheck, Headphones, Mic2 } from 'lucide-react';
import DeviceSelector from './DeviceSelector';
import VolumeControl from './VolumeControl';
import BoostControl from './BoostControl';
import EqualizerSection from './EqualizerSection';
import NoiseSuppressionToggle from './NoiseSuppressionToggle';

export default function AudioControls() {
  const {
    isListening,
    inputDevices,
    outputDevices,
    selectedInputDevice,
    selectedOutputDevice,
    volume,
    boostLevel,
    eqBands,
    noiseSuppression,
    error,
    toggleListening,
    updateVolume,
    updateBoostLevel,
    updateEQBand,
    toggleNoiseSuppression,
    changeInputDevice,
    setSelectedOutputDevice,
    EQ_BANDS,
  } = useAudioBooster();

  const inputLabel =
    inputDevices.find((device) => device.deviceId === selectedInputDevice)?.label ||
    'System default';
  const outputLabel =
    outputDevices.find((device) => device.deviceId === selectedOutputDevice)?.label ||
    'System default';

  return (
    <div className="relative min-h-screen overflow-hidden px-4 py-12 sm:px-6 lg:px-10">
      <div className="pointer-events-none absolute -left-32 top-24 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-10 top-10 h-80 w-80 rounded-full bg-warning/15 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-accent/12 blur-3xl" />

      <div className="relative mx-auto flex max-w-6xl flex-col gap-10">
        {/* Header */}
        <header className="flex flex-col gap-6 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center gap-3 sm:justify-start">
            <span className="status-pill bg-white/10 border-white/20 text-white/90">
              {isListening ? 'Live Session' : 'Standby'}
            </span>
            <span className="status-pill bg-accent/15 border-accent/25 text-accent">
              Studio Grade Processing
            </span>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-3 sm:justify-start">
                <Volume2 className="h-12 w-12 text-accent" />
                <h1 className="text-4xl font-bold text-white sm:text-5xl">TalkBox V3</h1>
              </div>
              <p className="max-w-xl text-sm text-dark-textMuted sm:text-base">
                Shape your sound in real-time with intelligent gain staging, eight-band EQ,
                and adaptive noise mitigation tailored for premium listening.
              </p>
            </div>
            <div className="flex justify-center sm:justify-end">
              <button
                onClick={toggleListening}
                className={`
                  group relative flex items-center gap-3 rounded-full px-7 py-3 text-sm font-semibold uppercase tracking-[0.25em]
                  transition-all duration-300
                  ${
                    isListening
                      ? 'bg-accent text-black shadow-[0_20px_45px_rgba(0,168,255,0.35)]'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }
                `}
              >
                {isListening ? (
                  <>
                    <Power className="h-5 w-5" />
                    Stop Session
                  </>
                ) : (
                  <>
                    <PowerOff className="h-5 w-5" />
                    Start Boost
                  </>
                )}
              </button>
            </div>
          </div>
        </header>

        <div className="grid gap-8 lg:grid-cols-[1.5fr_minmax(0,0.8fr)]">
          {/* Main Control Panel */}
          <section className="glass-panel p-7 space-y-7">
            <div className="flex flex-col gap-2 pb-4 border-b border-white/10">
              <h2 className="text-lg font-semibold text-white">Signal Chain</h2>
              <p className="text-xs text-dark-textMuted">
                Configure routing, levels, and enhancement before sending to the output stage.
              </p>
            </div>

            {error && (
              <div className="rounded-xl border border-warning/40 bg-warning/10 px-4 py-3 text-sm text-warning">
                {error}
              </div>
            )}

            <div className="grid gap-4 md:grid-cols-2">
              <DeviceSelector
                label="Input Device"
                devices={inputDevices}
                selectedDevice={selectedInputDevice}
                onChange={changeInputDevice}
                disabled={isListening}
              />
              <DeviceSelector
                label="Output Device"
                devices={outputDevices}
                selectedDevice={selectedOutputDevice}
                onChange={setSelectedOutputDevice}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <VolumeControl volume={volume} onChange={updateVolume} />
              <BoostControl boostLevel={boostLevel} onChange={updateBoostLevel} />
              <div className="md:col-span-2">
                <NoiseSuppressionToggle
                  enabled={noiseSuppression}
                  onChange={toggleNoiseSuppression}
                  disabled={isListening}
                />
              </div>
            </div>
          </section>

          {/* Session Snapshot */}
          <aside className="glass-card flex flex-col gap-6 p-7">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-[0.25em] text-dark-textMuted">
                Session Snapshot
              </h3>
              <p className="mt-2 text-xl font-semibold text-white">
                {isListening ? 'Live monitoring in progress' : 'Ready when you are'}
              </p>
            </div>

            <div className="space-y-4">
              <SnapshotRow
                icon={<Activity className="h-4 w-4" />}
                label="Output Dynamics"
                value={`${boostLevel > 0 ? '+' : ''}${boostLevel.toFixed(1)} dB boost`}
                hint={`Master level at ${volume}%`}
              />
              <SnapshotRow
                icon={<Mic2 className="h-4 w-4" />}
                label="Input"
                value={inputLabel}
                hint={isListening ? 'Streaming locked' : 'Changeable while idle'}
              />
              <SnapshotRow
                icon={<Headphones className="h-4 w-4" />}
                label="Output"
                value={outputLabel}
                hint="Route enhanced audio"
              />
              <SnapshotRow
                icon={<ShieldCheck className="h-4 w-4" />}
                label="Noise Control"
                value={noiseSuppression ? 'Adaptive suppression enabled' : 'Bypassed'}
                hint={noiseSuppression ? 'Reducing ambient noise floor' : 'Ambient sound preserved'}
              />
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-xs text-dark-textMuted">
              Tip: Save your favourite presets by noting the band positions after dialing in the
              perfect curve for each environment.
            </div>
          </aside>
        </div>

        <EqualizerSection
          eqBands={eqBands}
          onBandChange={updateEQBand}
          bandConfigs={EQ_BANDS}
        />

        {/* Footer */}
        <footer className="pb-6 text-center text-xs text-dark-textMuted">
          Built with Next.js • Web Audio API • Tailwind CSS
        </footer>
      </div>
    </div>
  );
}

interface SnapshotRowProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  hint: string;
}

function SnapshotRow({ icon, label, value, hint }: SnapshotRowProps) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-white/5 bg-white/3 px-4 py-3">
      <span className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-white/8 text-accent">
        {icon}
      </span>
      <div className="flex-1">
        <p className="text-sm font-semibold text-white/90">{label}</p>
        <p className="text-xs text-accent/90">{value}</p>
        <p className="text-[0.65rem] text-white/50">{hint}</p>
      </div>
    </div>
  );
}
