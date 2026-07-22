'use client';

import React, { useEffect, useState } from 'react';
import { calculateDuration, Duration } from '@/utils/time';
import { START_DATE } from '@/data/memories';
import { motion } from 'framer-motion';

export default function Counter() {
  const [duration, setDuration] = useState<Duration | null>(null);

  useEffect(() => {
    // Initial run
    setDuration(calculateDuration(START_DATE));

    const interval = setInterval(() => {
      setDuration(calculateDuration(START_DATE));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!duration) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="text-xl text-[#b1d0e9]/50 animate-pulse font-serif">
          Calculando nosso tempo juntos...
        </div>
      </div>
    );
  }

  const timeUnits = [
    { value: duration.years, label: duration.years === 1 ? 'ano' : 'anos' },
    { value: duration.days, label: duration.days === 1 ? 'dia' : 'dias' },
    { value: duration.hours, label: duration.hours === 1 ? 'hora' : 'horas' },
    { value: duration.minutes, label: duration.minutes === 1 ? 'minuto' : 'minutos' },
    { value: duration.seconds, label: duration.seconds === 1 ? 'segundo' : 'segundos' },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8">
      {/* Title */}
      <div className="text-center mb-10">
        <h2 className="text-sm uppercase tracking-[0.2em] text-primary/80 font-medium mb-2">
          Contador de Amor
        </h2>
        <p className="text-xs text-[#b1d0e9]/50">
          Desde 9 de Setembro de 2024 às 13:36
        </p>
      </div>

      {/* Grid of time cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6">
        {timeUnits.map((unit, index) => (
          <motion.div
            key={unit.label}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.6, ease: 'easeOut' }}
            className="glass-premium rounded-2xl p-6 md:p-8 flex flex-col items-center justify-center text-center relative overflow-hidden group hover:border-primary/20 transition-all duration-500"
          >
            {/* Glowing card effect */}
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            
            <span className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-2 text-glow-primary tracking-tight select-none">
              {String(unit.value).padStart(2, '0')}
            </span>
            <span className="text-xs md:text-sm text-[#b1d0e9]/60 font-light tracking-widest uppercase">
              {unit.label}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
