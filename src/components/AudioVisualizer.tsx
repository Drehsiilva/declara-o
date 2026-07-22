'use client';

import React, { useEffect, useRef } from 'react';

interface AudioVisualizerProps {
  analyser: AnalyserNode | null;
  isPlaying: boolean;
}

export default function AudioVisualizer({ analyser, isPlaying }: AudioVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bufferLength = analyser ? analyser.frequencyBinCount : 16;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      animationRef.current = requestAnimationFrame(draw);

      const width = canvas.width;
      const height = canvas.height;

      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      if (analyser && isPlaying) {
        analyser.getByteFrequencyData(dataArray);
      } else {
        // Flat line/silent pulses if not playing
        for (let i = 0; i < bufferLength; i++) {
          dataArray[i] = Math.sin(Date.now() * 0.005 + i) * 2 + 5;
        }
      }

      // Draw custom premium wave style bars
      const barWidth = (width / bufferLength) * 1.5;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        // Scale down the height slightly so it stays clean
        const percent = dataArray[i] / 255;
        const barHeight = Math.max(2, percent * height);

        // Gradient color from primary (#ff7b90) to secondary (#00f5d4)
        const gradient = ctx.createLinearGradient(0, height - barHeight, 0, height);
        gradient.addColorStop(0, '#ff7b90'); // Pink
        gradient.addColorStop(1, 'rgba(0, 245, 212, 0.4)'); // Teal

        ctx.fillStyle = gradient;
        
        // Rounded bar effect
        const roundedHeight = barHeight;
        const radius = barWidth / 2;
        
        ctx.beginPath();
        if (ctx.roundRect) {
          ctx.roundRect(x, height - roundedHeight, barWidth - 1, roundedHeight, radius);
        } else {
          ctx.rect(x, height - roundedHeight, barWidth - 1, roundedHeight);
        }
        ctx.fill();

        x += barWidth + 1;
      }
    };

    draw();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [analyser, isPlaying]);

  return (
    <canvas
      ref={canvasRef}
      width={120}
      height={32}
      className="opacity-70 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
    />
  );
}
