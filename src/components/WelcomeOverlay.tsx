'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAudioContext } from '@/context/AudioContext';
import { Heart } from 'lucide-react';

interface WelcomeOverlayProps {
  onEnter: () => void;
}

export default function WelcomeOverlay({ onEnter }: WelcomeOverlayProps) {
  const { play } = useAudioContext();
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Prevent scrolling while overlay is visible
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const handleEnter = () => {
    play(); // Start the music, unlocking Web Audio API
    setIsVisible(false);
    setTimeout(() => {
      onEnter();
    }, 800); // Allow exit animations to play out
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#050505] p-6 text-center select-none"
        >
          {/* Ambient Glows */}
          <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-secondary/5 rounded-full blur-[100px] pointer-events-none" />

          <div className="relative flex flex-col items-center max-w-lg z-10">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
              className="mb-8"
            >
              <Heart className="w-16 h-16 text-primary animate-pulse filter drop-shadow-[0_0_15px_rgba(255,123,144,0.6)]" />
            </motion.div>

            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-4xl md:text-5xl font-serif text-white mb-4 tracking-wide"
            >
              Nosso Tempo Juntos
            </motion.h1>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-[#b1d0e9]/70 text-lg md:text-xl font-light mb-12 max-w-md leading-relaxed"
            >
              Preparei uma surpresa especial para nós. Ligue o som para sentir cada momento desta homenagem.
            </motion.p>

            <motion.button
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleEnter}
              className="relative px-8 py-4 bg-gradient-to-r from-primary to-primary/80 text-white font-medium rounded-full cursor-pointer shadow-lg hover:shadow-primary/20 transition-all duration-300 flex items-center gap-2 group overflow-hidden border border-white/10"
            >
              <span className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <span className="relative flex items-center gap-2">
                Entrar na Homenagem
                <Heart className="w-4 h-4 fill-white group-hover:scale-125 transition-transform duration-300" />
              </span>
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
