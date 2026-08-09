import { useState, useEffect } from 'react';

export default function TopStatusBar() {
  const [time, setTime] = useState('');

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

      {/* Right — Spotify Music Link */}
      <div className="flex items-center">
        <a
          href="https://open.spotify.com/playlist/5dOAUCQfVbge7lodjgUGXq?si=c73mjsxcR5Cg4-CC9ZnL3g"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs md:text-sm tracking-wide transition-all duration-300 hover:brightness-125 font-medium"
          style={{ color: 'var(--color-cream-dim)' }}
        >
          Spotify <span className="text-[10px]">↗</span>
        </a>
      </div>
    </header>
  );
}
