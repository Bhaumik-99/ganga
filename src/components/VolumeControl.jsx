import { Volume2, VolumeX } from 'lucide-react';

export default function VolumeControl({ volume, isMuted, onVolumeChange, onToggleMute }) {
  return (
    <div className="hidden md:flex items-center gap-2 shrink-0">
      <button
        onClick={onToggleMute}
        className="p-1 transition-transform duration-200 hover:scale-110"
        style={{ color: 'var(--color-cream-dim)' }}
        aria-label={isMuted ? 'Unmute' : 'Mute'}
      >
        {isMuted || volume === 0 ? (
          <VolumeX size={16} />
        ) : (
          <Volume2 size={16} />
        )}
      </button>
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={isMuted ? 0 : volume}
        onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
        className="volume-slider"
        aria-label="Volume"
      />
    </div>
  );
}
