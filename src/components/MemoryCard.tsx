'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import { Memory } from '@/data/memories';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ZoomIn } from 'lucide-react';

interface MemoryCardProps {
  memory: Memory;
  index: number;
  onOpen: (memory: Memory) => void;
}

export default function MemoryCard({ memory, index, onOpen }: MemoryCardProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const imgContainerRef = useRef<HTMLDivElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const textRef = useRef<HTMLDivElement | null>(null);

  const isEven = index % 2 === 0;

  useEffect(() => {
    // Register scrolltrigger plugin
    gsap.registerPlugin(ScrollTrigger);

    const card = cardRef.current;
    const img = imgRef.current;
    const text = textRef.current;

    if (!card) return;

    // Card fade-in and slide-up entrance animation
    const revealTl = gsap.timeline({
      scrollTrigger: {
        trigger: card,
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
    });

    revealTl.fromTo(
      card,
      { opacity: 0, y: 60 },
      { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out' }
    );

    if (text) {
      revealTl.fromTo(
        text.children,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'power2.out' },
        '-=0.8'
      );
    }

    // Image Parallax scroll-linked animation
    if (img) {
      gsap.fromTo(
        img,
        { yPercent: -15, scale: 1.15 },
        {
          yPercent: 15,
          scale: 1.05,
          ease: 'none',
          scrollTrigger: {
            trigger: card,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        }
      );
    }

    return () => {
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.trigger === card) {
          trigger.kill();
        }
      });
    };
  }, []);

  return (
    <div
      ref={cardRef}
      className={`flex flex-col md:flex-row items-center gap-8 md:gap-16 w-full py-12 md:py-20 ${
        isEven ? 'md:flex-row' : 'md:flex-row-reverse'
      }`}
    >
      {/* Image Block */}
      <div className="w-full md:w-1/2 flex justify-center">
        <div
          ref={imgContainerRef}
          onClick={() => onOpen(memory)}
          className="relative w-full aspect-[4/3] max-w-[480px] rounded-2xl overflow-hidden border border-white/5 shadow-xl cursor-pointer group"
        >
          {/* Zoom Hover Icon Overlay */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-500 z-10">
            <ZoomIn className="w-8 h-8 text-white scale-75 group-hover:scale-100 transition-transform duration-500" />
          </div>

          <Image
            ref={imgRef}
            src={memory.imageUrl}
            alt={memory.alt}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 480px"
            className="object-cover"
            priority={index < 2}
          />
        </div>
      </div>

      {/* Text/Caption Block */}
      <div
        ref={textRef}
        className="w-full md:w-1/2 flex flex-col justify-center px-4"
      >
        <span className="text-sm font-serif font-semibold text-primary/80 tracking-widest mb-3 uppercase">
          Momento {String(index + 1).padStart(2, '0')}
        </span>
        <h3 className="text-2xl md:text-3xl font-serif text-white leading-relaxed mb-4 italic">
          &ldquo;{memory.caption}&rdquo;
        </h3>
        <div className="h-[2px] w-12 bg-gradient-to-r from-primary to-transparent" />
      </div>
    </div>
  );
}
