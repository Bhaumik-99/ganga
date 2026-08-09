import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';

export default function PlayerControls({ isPlaying, onToggle, onPrev, onNext }) {
  return (
    <div className="flex items-center gap-1.5 sm:gap-3 md:gap-4 shrink-0">
      {/* Previous */}
      <button
        onClick={onPrev}
        className="p-1.5 sm:p-2 text-white/70 hover:text-white transition-all duration-200 hover:scale-110 active:scale-95 rounded-full hover:bg-white/10"
        aria-label="Previous track"
        title="Previous Track"
      >
        <SkipBack size={18} className="sm:w-[20px] sm:h-[20px]" fill="currentColor" />
      </button>

      {/* Play / Pause */}
      <button
        onClick={onToggle}
        className={`flex items-center justify-center rounded-full transition-all duration-200 hover:scale-105 active:scale-95 shadow-xl ${
          isPlaying
            ? 'bg-[#F5EFE2] text-[#140a05] shadow-[0_0_20px_rgba(245,239,226,0.3)]'
            : 'bg-[#F5EFE2] text-[#140a05] hover:bg-white'
        }`}
        style={{
          width: 'clamp(40px, 5.5vw, 52px)',
          height: 'clamp(40px, 5.5vw, 52px)',
        }}
        aria-label={isPlaying ? 'Pause' : 'Play'}
        title={isPlaying ? 'Pause' : 'Play'}
      >
        {isPlaying ? (
          <Pause size={20} className="sm:w-[22px] sm:h-[22px]" fill="currentColor" />
        ) : (
          <Play size={20} className="sm:w-[22px] sm:h-[22px]" fill="currentColor" style={{ marginLeft: 2 }} />
        )}
      </button>

      {/* Next */}
      <button
        onClick={onNext}
        className="p-1.5 sm:p-2 text-white/70 hover:text-white transition-all duration-200 hover:scale-110 active:scale-95 rounded-full hover:bg-white/10"
        aria-label="Next track"
        title="Next Track"
      >
        <SkipForward size={18} className="sm:w-[20px] sm:h-[20px]" fill="currentColor" />
      </button>
    </div>
  );
}
