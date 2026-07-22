'use client';

import React, { useState } from 'react';
import { MEMORIES, Memory } from '@/data/memories';
import MemoryCard from './MemoryCard';
import Modal from './ui/Modal';
import { motion } from 'framer-motion';

export default function MemoryTimeline() {
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
  const [selectedIdx, setSelectedIdx] = useState<number>(-1);

  const handleOpenModal = (memory: Memory) => {
    const idx = MEMORIES.findIndex((m) => m.id === memory.id);
    setSelectedMemory(memory);
    setSelectedIdx(idx);
  };

  const handleCloseModal = () => {
    setSelectedMemory(null);
    setSelectedIdx(-1);
  };

  const handlePrev = () => {
    if (selectedIdx > 0) {
      const newIdx = selectedIdx - 1;
      setSelectedMemory(MEMORIES[newIdx]);
      setSelectedIdx(newIdx);
    } else {
      // Loop to end
      const newIdx = MEMORIES.length - 1;
      setSelectedMemory(MEMORIES[newIdx]);
      setSelectedIdx(newIdx);
    }
  };

  const handleNext = () => {
    if (selectedIdx < MEMORIES.length - 1) {
      const newIdx = selectedIdx + 1;
      setSelectedMemory(MEMORIES[newIdx]);
      setSelectedIdx(newIdx);
    } else {
      // Loop to start
      const newIdx = 0;
      setSelectedMemory(MEMORIES[newIdx]);
      setSelectedIdx(newIdx);
    }
  };

  return (
    <section className="relative w-full max-w-6xl mx-auto px-6 py-24 select-none">
      {/* Central timeline line */}
      <div className="absolute left-1/2 top-10 bottom-10 w-[2px] bg-gradient-to-b from-primary via-primary/30 to-transparent -translate-x-1/2 opacity-20 pointer-events-none hidden md:block" />

      {/* Header */}
      <div className="text-center mb-16 relative">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
          className="text-3xl md:text-5xl font-serif text-white tracking-wide"
        >
          Nossos Momentos ❤️
        </motion.h2>
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="h-[2px] w-24 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mt-4 origin-center"
        />
      </div>

      {/* List of cards */}
      <div className="flex flex-col gap-12 relative z-10">
        {MEMORIES.map((memory, index) => (
          <div key={memory.id} className="relative">
            {/* Timeline node point */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-primary border-4 border-[#050505] shadow-[0_0_10px_rgba(255,123,144,0.6)] z-20 pointer-events-none hidden md:block" />
            
            <MemoryCard
              memory={memory}
              index={index}
              onOpen={handleOpenModal}
            />
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      <Modal
        isOpen={selectedMemory !== null}
        onClose={handleCloseModal}
        memory={selectedMemory}
        onPrev={handlePrev}
        onNext={handleNext}
      />
    </section>
  );
}
