import { useState, useEffect } from 'react';

export default function TopStatusBar() {
  const [time, setTime] = useState('');
  const [onlineCount, setOnlineCount] = useState(38);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'pm' : 'am';
      hours = hours % 12 || 12;
      setTime(`${hours}:${minutes} ${ampm}`);
    };

    updateClock();
    const interval = setInterval(updateClock, 10000);
    return () => clearInterval(interval);
  }, []);

  // Subtle natural online listener count variation
  useEffect(() => {
    const interval = setInterval(() => {
      setOnlineCount((prev) => {
        const delta = Math.floor(Math.random() * 3) - 1;
        return Math.max(32, Math.min(54, prev + delta));
      });
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 md:px-10 md:py-5 animate-fade-in"
      style={{ fontFamily: 'var(--font-ui)' }}
    >
      {/* Left — Clock */}
      <div
        className="text-xs md:text-sm tracking-widest uppercase font-medium"
        style={{ color: 'var(--color-white-soft)' }}
      >
        {time}
      </div>

      {/* Center — Live Status Indicator */}
      <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-black/20 border border-white/10 backdrop-blur-md">
        {/* Pulsing Green Live Dot */}
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-[0_0_8px_#10b981]" />
        </span>

        {/* Live Text & Online Count */}
        <span
          className="text-xs tracking-wide font-medium flex items-center gap-1.5"
          style={{ color: 'var(--color-white-soft)' }}
        >
          <span className="text-emerald-400 font-semibold tracking-wider text-[11px]">LIVE</span>
          <span className="text-white/40">•</span>
          <span>{onlineCount} listening</span>
        </span>
      </div>

      {/* Right — Music Links */}
      <div className="flex items-center gap-4 md:gap-6">
        <a
          href="https://open.spotify.com/playlist/5dOAUCQfVbge7lodjgUGXq?si=Htv-Mc-qR8m_GKoIsOy2sA"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs md:text-sm tracking-wide transition-all duration-300 hover:brightness-125 font-medium"
          style={{ color: 'var(--color-cream-dim)' }}
        >
          Spotify <span className="text-[10px]">↗</span>
        </a>
        <a
          href="https://music.youtube.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs md:text-sm tracking-wide transition-all duration-300 hover:brightness-125 font-medium"
          style={{ color: 'var(--color-cream-dim)' }}
        >
          YT Music <span className="text-[10px]">↗</span>
        </a>
      </div>
    </header>
  );
}
