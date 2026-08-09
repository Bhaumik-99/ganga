import { useCallback } from 'react';

function formatTime(seconds) {
  if (!seconds || isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${mins}:${secs}`;
}

export default function ProgressBar({ currentTime, duration, onSeek }) {
  const progress = duration ? (currentTime / duration) * 100 : 0;

  const handleClick = useCallback(
    (e) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const fraction = (e.clientX - rect.left) / rect.width;
      onSeek(Math.max(0, Math.min(1, fraction)));
    },
    [onSeek]
  );

  return (
    <div className="w-full">
      {/* Progress track */}
      <div className="progress-track" onClick={handleClick}>
        <div
          className="progress-fill"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Time labels */}
      <div className="flex justify-between mt-1.5">
        <span
          className="text-[10px] tabular-nums"
          style={{ color: 'var(--color-cream-dim)' }}
        >
          {formatTime(currentTime)}
        </span>
        <span
          className="text-[10px] tabular-nums"
          style={{ color: 'var(--color-cream-dim)' }}
        >
          {formatTime(duration)}
        </span>
      </div>
    </div>
  );
}
