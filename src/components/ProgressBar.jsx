import { useState, useCallback } from 'react';

function formatTime(seconds) {
  if (!seconds || isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${mins}:${secs}`;
}

export default function ProgressBar({ currentTime = 0, duration = 0, onSeek }) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragValue, setDragValue] = useState(0);

  const displayTime = isDragging ? dragValue : currentTime;
  const progressPercent = duration > 0 ? (displayTime / duration) * 100 : 0;

  const commitSeek = useCallback(
    (val) => {
      if (duration > 0 && onSeek) {
        const fraction = Math.max(0, Math.min(1, val / duration));
        onSeek(fraction);
      }
    },
    [duration, onSeek]
  );

  const handleChange = (e) => {
    const val = parseFloat(e.target.value);
    setDragValue(val);
    if (!isDragging) {
      commitSeek(val);
    }
  };

  const handleMouseDown = () => {
    setIsDragging(true);
    setDragValue(currentTime);
  };

  const handleMouseUp = () => {
    if (isDragging) {
      commitSeek(dragValue);
      setIsDragging(false);
    }
  };

  const handleTouchStart = () => {
    setIsDragging(true);
    setDragValue(currentTime);
  };

  const handleTouchEnd = () => {
    if (isDragging) {
      commitSeek(dragValue);
      setIsDragging(false);
    }
  };

  return (
    <div className="w-full flex items-center gap-2.5 sm:gap-3 select-none">
      {/* Current Elapsed Time */}
      <span
        className={`text-[10px] sm:text-xs font-mono tabular-nums shrink-0 transition-colors ${
          isDragging ? 'text-[#1DB954] font-semibold' : 'text-[#F5EFE2]/60'
        }`}
      >
        {formatTime(displayTime)}
      </span>

      {/* Interactive Timeline Slider Track */}
      <div className="relative flex-1 flex items-center group cursor-pointer py-1">
        {/* Background Track */}
        <div className="w-full h-1 sm:h-1.5 bg-white/10 group-hover:bg-white/20 rounded-full overflow-hidden transition-all duration-200 group-hover:h-2">
          {/* Filled Progress Bar */}
          <div
            className="h-full bg-gradient-to-r from-[#F5F0E8] via-[#E6DCC8] to-[#1DB954] rounded-full transition-all duration-75"
            style={{ width: `${Math.min(100, Math.max(0, progressPercent))}%` }}
          />
        </div>

        {/* Hidden/Styled Range Input for Drag & Seek */}
        <input
          type="range"
          min={0}
          max={duration || 100}
          step={0.1}
          value={displayTime}
          onChange={handleChange}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          disabled={!duration}
          aria-label="Song Timeline Seek Slider"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed z-10"
        />

        {/* Glow Thumb indicator on hover or drag */}
        <div
          className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 sm:w-3.5 sm:h-3.5 bg-[#F5F0E8] rounded-full shadow-[0_0_10px_rgba(255,255,255,0.9)] pointer-events-none transition-transform duration-150 ${
            isDragging ? 'scale-125 bg-[#1DB954]' : 'scale-0 group-hover:scale-100'
          }`}
          style={{ left: `${Math.min(100, Math.max(0, progressPercent))}%` }}
        />
      </div>

      {/* Total Duration */}
      <span className="text-[10px] sm:text-xs font-mono tabular-nums shrink-0 text-[#F5EFE2]/60">
        {formatTime(duration)}
      </span>
    </div>
  );
}
