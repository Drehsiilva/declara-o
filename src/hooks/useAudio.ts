'use client';

import { useEffect, useRef, useState } from 'react';

interface UseAudioReturn {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  toggle: () => void;
  play: () => void;
  pause: () => void;
  setVolume: (vol: number) => void;
  analyser: AnalyserNode | null;
}

export function useAudio(src: string): UseAudioReturn {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(0.8);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);

  useEffect(() => {
    // Create audio element
    const audio = new Audio(src);
    audio.loop = true;
    audio.volume = volume;
    audioRef.current = audio;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onDurationChange = () => setDuration(audio.duration);
    const onEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('durationchange', onDurationChange);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.pause();
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('durationchange', onDurationChange);
      audio.removeEventListener('ended', onEnded);
      audioRef.current = null;
      
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
    };
  }, [src]);

  const initAudioContext = () => {
    if (!audioRef.current || audioContextRef.current) return;

    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      const analyserNode = ctx.createAnalyser();
      analyserNode.fftSize = 64; // Small fftSize for a clean wave visualizer

      const source = ctx.createMediaElementSource(audioRef.current);
      source.connect(analyserNode);
      analyserNode.connect(ctx.destination);

      audioContextRef.current = ctx;
      sourceRef.current = source;
      setAnalyser(analyserNode);
    } catch (e) {
      console.error('Failed to initialize Web Audio API Context:', e);
    }
  };

  const play = () => {
    if (!audioRef.current) return;
    initAudioContext();

    if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }

    audioRef.current.play()
      .then(() => setIsPlaying(true))
      .catch((err) => console.log('Audio playback failed or blocked:', err));
  };

  const pause = () => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    setIsPlaying(false);
  };

  const toggle = () => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  };

  const setVolume = (vol: number) => {
    const safeVol = Math.max(0, Math.min(1, vol));
    setVolumeState(safeVol);
    if (audioRef.current) {
      audioRef.current.volume = safeVol;
    }
  };

  return {
    isPlaying,
    currentTime,
    duration,
    volume,
    toggle,
    play,
    pause,
    setVolume,
    analyser,
  };
}
