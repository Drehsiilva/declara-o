'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useAudio } from '@/hooks/useAudio';

interface AudioContextType {
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

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: ReactNode }) {
  const audio = useAudio('/audio/music-tu-es.mp3');

  return (
    <AudioContext.Provider value={audio}>
      {children}
    </AudioContext.Provider>
  );
}

export function useAudioContext() {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudioContext must be used within an AudioProvider');
  }
  return context;
}
