'use client';

import { useState, useEffect, useRef } from 'react';
import React from 'react';

export interface AudioSettings {
  volume: number;
  boostLevel: number;
  eqBands: number[];
  noiseSuppression: boolean;
  selectedInputDevice: string;
  selectedOutputDevice: string;
}

interface Device {
  deviceId: string;
  label: string;
}

export const useAudioBooster = () => {
  const [isListening, setIsListening] = useState(false);
  const [inputDevices, setInputDevices] = useState<Device[]>([]);
  const [outputDevices, setOutputDevices] = useState<Device[]>([]);
  const [selectedInputDevice, setSelectedInputDevice] = useState('default');
  const [selectedOutputDevice, setSelectedOutputDevice] = useState('default');
  const [volume, setVolume] = useState(50);
  const [boostLevel, setBoostLevel] = useState(0);
  const [noiseSuppression, setNoiseSuppressionEnabled] = useState(false);
  const [eqBands, setEQBands] = useState([0, 0, 0, 0, 0, 0, 0, 0]);
  const [error, setError] = useState<string | null>(null);

  // Audio nodes
  const audioContextRef = useRef<AudioContext | null>(null);
  const micSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const volumeGainRef = useRef<GainNode | null>(null);
  const boostGainRef = useRef<GainNode | null>(null);
  const filtersRef = useRef<BiquadFilterNode[]>([]);
  const compressorRef = useRef<DynamicsCompressorNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // EQ Band configuration
  const EQ_BANDS = [
    { freq: 60, type: 'lowshelf' as const },
    { freq: 150, type: 'peaking' as const },
    { freq: 400, type: 'peaking' as const },
    { freq: 1000, type: 'peaking' as const },
    { freq: 2400, type: 'peaking' as const },
    { freq: 6000, type: 'peaking' as const },
    { freq: 15000, type: 'peaking' as const },
    { freq: 20000, type: 'highshelf' as const },
  ];

  // Load saved settings from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('soundBoosterSettings');
    if (saved) {
      try {
        const settings: AudioSettings = JSON.parse(saved);
        setVolume(settings.volume);
        setBoostLevel(settings.boostLevel);
        setEQBands(settings.eqBands);
        setNoiseSuppressionEnabled(settings.noiseSuppression);
        setSelectedInputDevice(settings.selectedInputDevice);
        setSelectedOutputDevice(settings.selectedOutputDevice);
      } catch (err) {
        console.error('Failed to load settings:', err);
      }
    }
  }, []);

  // Enumerate devices
  useEffect(() => {
    const enumDevices = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        
        const inputs = devices
          .filter(d => d.kind === 'audioinput')
          .map(d => ({
            deviceId: d.deviceId,
            label: d.label || `Microphone ${d.deviceId.slice(0, 5)}`,
          }));
        
        const outputs = devices
          .filter(d => d.kind === 'audiooutput')
          .map(d => ({
            deviceId: d.deviceId,
            label: d.label || `Speaker ${d.deviceId.slice(0, 5)}`,
          }));

        setInputDevices(inputs);
        setOutputDevices(outputs);
      } catch (err) {
        console.error('Failed to enumerate devices:', err);
        setError('Failed to access audio devices');
      }
    };

    enumDevices();
    navigator.mediaDevices.addEventListener('devicechange', enumDevices);
    return () => navigator.mediaDevices.removeEventListener('devicechange', enumDevices);
  }, []);

  // Save settings to localStorage
  const saveSettings = () => {
    const settings: AudioSettings = {
      volume,
      boostLevel,
      eqBands,
      noiseSuppression,
      selectedInputDevice,
      selectedOutputDevice,
    };
    localStorage.setItem('soundBoosterSettings', JSON.stringify(settings));
  };

  useEffect(() => {
    saveSettings();
  }, [volume, boostLevel, eqBands, noiseSuppression, selectedInputDevice, selectedOutputDevice]);

  // Initialize audio context and nodes
  const initializeAudio = async () => {
    try {
      if (!audioContextRef.current) {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({
          latencyHint: 'interactive',
        });
        audioContextRef.current = audioContext;

        // Create nodes
        const volumeGain = audioContext.createGain();
        const boostGain = audioContext.createGain();
        const filters: BiquadFilterNode[] = [];
        const compressor = audioContext.createDynamicsCompressor();
        const analyser = audioContext.createAnalyser();

        // Configure compressor (safety limiting)
        compressor.threshold.value = -10;
        compressor.knee.value = 20;
        compressor.ratio.value = 12;
        compressor.attack.value = 0.003;
        compressor.release.value = 0.25;

        // Configure analyser
        analyser.fftSize = 2048;

        // Create EQ filters
        EQ_BANDS.forEach((band, i) => {
          const filter = audioContext.createBiquadFilter();
          filter.type = band.type;
          filter.frequency.value = band.freq;
          filter.Q.value = 1.0;
          filter.gain.value = eqBands[i];
          filters.push(filter);
        });

        // Store references
        volumeGainRef.current = volumeGain;
        boostGainRef.current = boostGain;
        filtersRef.current = filters;
        compressorRef.current = compressor;
        analyserRef.current = analyser;

        // Set initial gain values
        volumeGain.gain.value = volume / 100;
        boostGain.gain.value = 1 + boostLevel / 10;
      }

      // Get microphone stream
      const constraints: MediaStreamConstraints = {
        audio: {
          deviceId: selectedInputDevice !== 'default' ? { exact: selectedInputDevice } : undefined,
          echoCancellation: noiseSuppression,
          noiseSuppression: noiseSuppression,
          autoGainControl: false,
        },
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      const micSource = audioContextRef.current!.createMediaStreamSource(stream);
      micSourceRef.current = micSource;

      // Connect audio graph: mic -> volume -> boost -> filters -> compressor -> analyser -> destination
      let currentNode: AudioNode = micSource;
      currentNode.connect(volumeGainRef.current!);
      currentNode = volumeGainRef.current!;
      currentNode.connect(boostGainRef.current!);
      currentNode = boostGainRef.current!;

      // Connect EQ filters in series
      filtersRef.current.forEach((filter) => {
        currentNode.connect(filter);
        currentNode = filter;
      });

      currentNode.connect(compressorRef.current!);
      compressorRef.current!.connect(analyserRef.current!);
      analyserRef.current!.connect(audioContextRef.current!.destination);

      setIsListening(true);
      setError(null);
    } catch (err: any) {
      console.error('Failed to initialize audio:', err);
      setError(err.message || 'Failed to access microphone');
      setIsListening(false);
    }
  };

  // Stop audio processing
  const stopAudio = () => {
    if (micSourceRef.current) {
      micSourceRef.current.disconnect();
      micSourceRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    setIsListening(false);
  };

  // Toggle listening
  const toggleListening = () => {
    if (isListening) {
      stopAudio();
    } else {
      initializeAudio();
    }
  };

  // Update volume
  const updateVolume = (newVolume: number) => {
    setVolume(newVolume);
    if (volumeGainRef.current) {
      volumeGainRef.current.gain.value = newVolume / 100;
    }
  };

  // Update boost level
  const updateBoostLevel = (newBoost: number) => {
    setBoostLevel(newBoost);
    if (boostGainRef.current) {
      boostGainRef.current.gain.value = 1 + newBoost / 10;
    }
  };

  // Update EQ band
  const updateEQBand = (index: number, value: number) => {
    const newBands = [...eqBands];
    newBands[index] = value;
    setEQBands(newBands);

    if (filtersRef.current[index]) {
      filtersRef.current[index].gain.value = value;
    }
  };

  // Toggle noise suppression
  const toggleNoiseSuppression = () => {
    const newValue = !noiseSuppression;
    setNoiseSuppressionEnabled(newValue);
    
    // Need to restart audio with new constraints
    if (isListening) {
      stopAudio();
      setTimeout(() => initializeAudio(), 100);
    }
  };

  // Change input device
  const changeInputDevice = (deviceId: string) => {
    setSelectedInputDevice(deviceId);
    
    // Need to restart audio with new device
    if (isListening) {
      stopAudio();
      setTimeout(() => initializeAudio(), 100);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAudio();
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  return {
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
  };
};
