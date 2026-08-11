import { useState, useEffect } from 'react';

export default function LoadingScreen({ isLoaded, onFinish }) {
  const [progress, setProgress] = useState(0);
  const [shouldRender, setShouldRender] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  // Safety fallback: Force progress to 100% after 2.5 seconds max
  useEffect(() => {
    const safetyTimer = setTimeout(() => {
      setProgress(100);
    }, 2500);
    return () => clearTimeout(safetyTimer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        const increment = isLoaded ? 20 : Math.floor(Math.random() * 10) + 5;
        return Math.min(prev + increment, 100);
      });
    }, 50);

    return () => clearInterval(interval);
  }, [isLoaded]);

  useEffect(() => {
    if (progress === 100) {
      const timer = setTimeout(() => {
        setFadeOut(true);
        const removeTimer = setTimeout(() => {
          setShouldRender(false);
          if (onFinish) onFinish();
        }, 600);
        return () => clearTimeout(removeTimer);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [progress, onFinish]);

  if (!shouldRender) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#140a05] transition-all duration-700 cubic-bezier(0.16, 1, 0.3, 1) ${
        fadeOut ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
      style={{ fontFamily: 'var(--font-hindi)' }}
    >
      {/* Background glow */}
      <div
        className="absolute w-96 h-96 rounded-full blur-3xl opacity-20 animate-pulse-subtle pointer-events-none"
        style={{ background: 'radial-gradient(circle, #8b3723 0%, transparent 70%)' }}
      />

      {/* Decorative center icon/logo */}
      <div className="relative mb-6 flex items-center justify-center">
        {/* Outer rotating ring */}
        <div className="w-20 h-20 rounded-full border border-dashed border-[#8b7355]/40 animate-spin-slow" />
        
        {/* Inner glowing core */}
        <div className="absolute w-10 h-10 rounded-full bg-[#8b3723]/30 border border-[#f5f0e8]/20 flex items-center justify-center backdrop-blur-sm">
          <span className="text-[#f5f0e8] text-sm animate-pulse">✦</span>
        </div>
      </div>

      {/* Hindi Title */}
      <h2 className="text-3xl md:text-4xl text-[#f5f0e8] tracking-wide font-normal mb-2 text-center drop-shadow-md">
        गंगा के किनारे
      </h2>

      {/* Subtext */}
      <p
        className="text-xs md:text-sm tracking-widest text-[#8b7355] uppercase mb-8"
        style={{ fontFamily: 'var(--font-ui)' }}
      >
        Loading experience...
      </p>

      {/* Progress Bar Container */}
      <div className="w-48 md:w-64 h-[2px] bg-white/10 rounded-full overflow-hidden relative">
        <div
          className="h-full bg-[#f5f0e8] transition-all duration-200 ease-out rounded-full shadow-[0_0_10px_rgba(245,240,232,0.8)]"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Percentage */}
      <span
        className="mt-3 text-[11px] tracking-widest text-white/40 font-mono"
        style={{ fontFamily: 'var(--font-ui)' }}
      >
        {progress}%
      </span>
    </div>
  );
}
