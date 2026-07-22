'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import WelcomeOverlay from '@/components/WelcomeOverlay';
import SmoothScroll from '@/components/SmoothScroll';
import Counter from '@/components/Counter';
import MemoryTimeline from '@/components/MemoryTimeline';
import MusicPlayer from '@/components/MusicPlayer';
import { motion } from 'framer-motion';

// Load Three.js 3D scene dynamically (client-side only)
const InteractiveScene = dynamic(
  () => import('@/components/InteractiveScene'),
  { ssr: false }
);

export default function Home() {
  const [hasEntered, setHasEntered] = useState(false);

  return (
    <>
      {/* 3D background canvas, always present but sitting in background */}
      <InteractiveScene />

      {/* 1. Enter Overlay */}
      <WelcomeOverlay onEnter={() => setHasEntered(true)} />

      {/* 2. Main Site Content (Unmounted or hidden until clicked Enter for performance) */}
      {hasEntered && (
        <SmoothScroll>
          <div className="relative z-10 w-full min-h-screen flex flex-col items-center">
            
            {/* Scroll Indicator line on top */}
            <div className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary via-secondary to-primary z-50 pointer-events-none" />

            {/* Header / Hero Section */}
            <header className="w-full max-w-5xl mx-auto pt-24 pb-12 px-6 text-center">
              <motion.h1
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
                className="text-4xl md:text-7xl font-serif text-white tracking-wide text-glow-primary mb-6"
              >
                Nosso Tempo Juntos ❤️
              </motion.h1>
            </header>

            {/* Live Counter */}
            <section className="w-full">
              <Counter />
            </section>

            {/* Memory Timeline */}
            <MemoryTimeline />

            {/* Final Love Letter Section */}
            <footer className="w-full max-w-4xl mx-auto px-6 py-24 text-center">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 1 }}
                className="glass-premium rounded-3xl p-8 md:p-12 border border-white/5 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
                
                <h4 className="text-sm font-serif font-semibold text-primary/80 tracking-widest mb-6 uppercase">
                  Uma Cartinha Para Você
                </h4>

                <p className="text-lg md:text-xl text-[#b1d0e9]/80 font-light leading-relaxed mb-8 max-w-2xl mx-auto">
                  Então é isso meu amor, queria poder te dar o mundo, mas vou adiar um pouquinho isso, tá?
                  Mas tudo aqui foi de coração. Eu te amo muito de verdade, quero passar o resto dos dias da minha vida com você!
                </p>

                <p className="text-3xl md:text-4xl font-serif font-bold text-glow-primary text-[#ff7b90] tracking-wider animate-pulse">
                  FELIZ DIA DOS NAMORADOS! ❤️
                </p>
              </motion.div>
            </footer>

            {/* Floating Music Player */}
            <MusicPlayer />
          </div>
        </SmoothScroll>
      )}
    </>
  );
}
