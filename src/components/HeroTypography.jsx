import { useState, useCallback } from 'react';

export default function HeroTypography() {
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e) => {
    const { innerWidth, innerHeight } = window;
    const x = ((e.clientX / innerWidth) - 0.5) * 8;
    const y = ((e.clientY / innerHeight) - 0.5) * 5;
    setOffset({ x, y });
  }, []);

  return (
    <div
      className="fixed inset-0 z-10 flex items-center justify-center pointer-events-none select-none overflow-hidden"
      onMouseMove={handleMouseMove}
      style={{ pointerEvents: 'all' }}
    >
      {/* 
        Center-aligned Hero Poster Typography
      */}
      <div
        className="animate-fade-up relative flex flex-col items-center justify-center text-center"
        style={{
          transform: `translate(${offset.x}px, ${offset.y}px)`,
          transition: 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          marginTop: '-4vh',
        }}
      >
        {/* Soft, completely blended dark radial gradient for contrast against background artwork */}
        <div
          className="absolute -inset-16 md:-inset-24 rounded-full pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(14, 7, 3, 0.6) 0%, rgba(14, 7, 3, 0.25) 50%, transparent 75%)',
            filter: 'blur(16px)',
          }}
        />

        {/* Display Devanagari Poster Typography */}
        <h1
          className="relative flex flex-col items-center text-center"
          style={{
            fontFamily: "var(--font-hindi), 'Rozha One', 'Yatra One', serif",
            color: '#F5EFE2',
            opacity: 0.95,
            textShadow: '0 4px 30px rgba(10, 5, 2, 0.7), 0 2px 4px rgba(0, 0, 0, 0.5)',
            letterSpacing: '-0.02em',
            userSelect: 'none',
          }}
        >
          {/* Line 1: ganga ke */}
          <span
            style={{
              fontSize: 'clamp(2.8rem, 7.5vw, 125px)',
              lineHeight: 1.0,
              fontWeight: 700,
              display: 'block',
            }}
          >
            गंगा के
          </span>

          {/* Line 2: kinare (with increased gap between lines) */}
          <span
            style={{
              fontSize: 'clamp(3.4rem, 9vw, 150px)',
              lineHeight: 1.0,
              fontWeight: 800,
              display: 'block',
              marginTop: '0.10em', // Increased gap between lines
            }}
          >
            किनारे
          </span>
        </h1>
      </div>
    </div>
  );
}
