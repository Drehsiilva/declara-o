'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { Memory } from '@/data/memories';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  memory: Memory | null;
  onPrev: () => void;
  onNext: () => void;
}

export default function Modal({ isOpen, onClose, memory, onPrev, onNext }: ModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    // Handle ESC and arrows for navigation
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, onPrev, onNext]);

  return (
    <AnimatePresence>
      {isOpen && memory && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 select-none"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 text-white/60 hover:text-white cursor-pointer bg-white/5 p-2 rounded-full hover:bg-white/10 transition-all duration-300"
            aria-label="Fechar visualização"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Left Navigation */}
          <button
            onClick={onPrev}
            className="absolute left-6 text-white/60 hover:text-white cursor-pointer bg-white/5 p-3 rounded-full hover:bg-white/10 transition-all duration-300 z-10"
            aria-label="Foto anterior"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Image Container */}
          <div className="flex flex-col items-center max-w-4xl w-full">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 180 }}
              className="relative w-full aspect-[4/3] md:aspect-[16/10] max-h-[70vh] rounded-xl overflow-hidden shadow-2xl border border-white/10"
            >
              <Image
                src={memory.imageUrl}
                alt={memory.alt}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                className="object-contain"
                priority
              />
            </motion.div>

            {/* Caption */}
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-6 text-center max-w-xl px-4"
            >
              <p className="text-white text-lg font-serif italic leading-relaxed">
                {memory.caption}
              </p>
            </motion.div>
          </div>

          {/* Right Navigation */}
          <button
            onClick={onNext}
            className="absolute right-6 text-white/60 hover:text-white cursor-pointer bg-white/5 p-3 rounded-full hover:bg-white/10 transition-all duration-300 z-10"
            aria-label="Próxima foto"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
