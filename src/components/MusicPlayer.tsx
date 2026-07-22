'use client';

import React, { useState } from 'react';
import { useAudioContext } from '@/context/AudioContext';
import AudioVisualizer from './AudioVisualizer';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function MusicPlayer() {
  const { isPlaying, toggle, volume, setVolume, analyser } = useAudioContext();
  const [showVolume, setShowVolume] = useState(false);
  const [prevVolume, setPrevVolume] = useState(0.8);

  const handleMuteToggle = () => {
    if (volume > 0) {
      setPrevVolume(volume);
      setVolume(0);
    } else {
      setVolume(prevVolume);
    }
  };

  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 1, duration: 0.8, ease: 'easeOut' }}
      className="fixed bottom-6 right-6 z-40 flex items-center gap-4 px-4 py-3 glass rounded-full shadow-2xl hover:border-primary/20 transition-all duration-300 group"
      onMouseEnter={() => setShowVolume(true)}
      onMouseLeave={() => setShowVolume(false)}
    >
      {/* Play/Pause Button */}
      <button
        onClick={toggle}
        className="w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-r from-primary to-primary/80 hover:from-primary hover:to-primary text-white cursor-pointer shadow-md shadow-primary/10 hover:scale-105 transition-all duration-300"
        aria-label={isPlaying ? 'Pausar música' : 'Tocar música'}
      >
        {isPlaying ? (
          <Pause className="w-4 h-4 fill-white text-white" />
        ) : (
          <Play className="w-4 h-4 fill-white text-white translate-x-[1px]" />
        )}
      </button>

      {/* Visualizer */}
      <div className="flex flex-col justify-center">
        <AudioVisualizer analyser={analyser} isPlaying={isPlaying} />
        <span className="text-[10px] text-[#b1d0e9]/40 tracking-wider font-light uppercase mt-1 select-none">
          {isPlaying ? 'Tocando' : 'Pausado'}
        </span>
      </div>

      {/* Volume Controls */}
      <div className="flex items-center gap-2 border-l border-white/10 pl-3">
        <button
          onClick={handleMuteToggle}
          className="text-[#b1d0e9]/60 hover:text-white cursor-pointer transition-colors"
          aria-label={volume === 0 ? 'Desmutar' : 'Mutar'}
        >
          {volume === 0 ? (
            <VolumeX className="w-4 h-4" />
          ) : (
            <Volume2 className="w-4 h-4" />
          )}
        </button>

        <AnimatePresence>
          {showVolume && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 60, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden flex items-center"
            >
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-full accent-primary bg-white/10 h-[3px] rounded-full cursor-pointer appearance-none outline-none"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
