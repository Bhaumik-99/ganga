import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';

export default function PlayerControls({ isPlaying, onToggle, onPrev, onNext }) {
  return (
    <div className="flex items-center gap-3 md:gap-4 shrink-0">
      {/* Previous */}
      <button
        onClick={onPrev}
        className="p-1.5 transition-transform duration-200 hover:scale-110 active:scale-95"
        style={{ color: 'var(--color-cream-dim)' }}
        aria-label="Previous track"
      >
        <SkipBack size={20} fill="currentColor" />
      </button>

      {/* Play / Pause */}
      <button
        onClick={onToggle}
        className={`flex items-center justify-center rounded-full transition-all duration-200 hover:scale-105 active:scale-95 ${
          isPlaying ? 'animate-pulse-subtle' : ''
        }`}
        style={{
          width: 'clamp(42px, 5.5vw, 50px)',
          height: 'clamp(42px, 5.5vw, 50px)',
          backgroundColor: 'var(--color-cream)',
          color: '#1a0e08',
        }}
        aria-label={isPlaying ? 'Pause' : 'Play'}
      >
        {isPlaying ? (
          <Pause size={22} fill="currentColor" />
        ) : (
          <Play size={22} fill="currentColor" style={{ marginLeft: 2 }} />
        )}
      </button>

      {/* Next */}
      <button
        onClick={onNext}
        className="p-1.5 transition-transform duration-200 hover:scale-110 active:scale-95"
        style={{ color: 'var(--color-cream-dim)' }}
        aria-label="Next track"
      >
        <SkipForward size={20} fill="currentColor" />
      </button>
    </div>
  );
}
