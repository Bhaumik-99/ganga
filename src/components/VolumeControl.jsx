import { useState, useEffect } from 'react';
import { Volume2, Volume1, VolumeX } from 'lucide-react';

export default function VolumeControl({ volume, isMuted, onVolumeChange, onToggleMute }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const displayVolume = isMuted ? 0 : volume;
  const percentage = Math.round(displayVolume * 100);

  // Keep open while hovering or dragging
  const isOpen = isHovered || isDragging;

  // Global mouseup & touchend listener to ensure smooth dragging even outside container
  useEffect(() => {
    if (!isDragging) return;

    const handleDragEnd = () => {
      setIsDragging(false);
    };

    window.addEventListener('mouseup', handleDragEnd);
    window.addEventListener('touchend', handleDragEnd);
    return () => {
      window.removeEventListener('mouseup', handleDragEnd);
      window.removeEventListener('touchend', handleDragEnd);
    };
  }, [isDragging]);

  const renderIcon = () => {
    if (isMuted || displayVolume === 0) return <VolumeX size={18} />;
    if (displayVolume < 0.5) return <Volume1 size={18} />;
    return <Volume2 size={18} />;
  };

  return (
    <div
      className="relative flex items-center shrink-0"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Glassmorphic Capsule Wrapper */}
      <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 backdrop-blur-md transition-all duration-300">
        {/* Toggle Mute Button */}
        <button
          onClick={onToggleMute}
          className="text-white/70 hover:text-white transition-colors duration-200 p-0.5 focus:outline-none"
          aria-label={isMuted ? 'Unmute' : 'Mute'}
          title={isMuted ? 'Unmute' : `Mute (${percentage}%)`}
        >
          {renderIcon()}
        </button>

        {/* Expandable Precision Slider Container */}
        <div
          className={`overflow-hidden transition-all duration-300 ease-out flex items-center gap-2 ${
            isOpen ? 'w-28 opacity-100' : 'w-0 opacity-0 md:w-20 md:opacity-80'
          }`}
        >
          {/* Slider input */}
          <div className="relative flex-1 flex items-center">
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={displayVolume}
              onMouseDown={() => setIsDragging(true)}
              onTouchStart={() => setIsDragging(true)}
              onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#F5EFE2] hover:accent-[#1DB954] transition-all"
              aria-label="Volume Slider"
            />
          </div>

          {/* Percentage badge */}
          {isOpen && (
            <span className="text-[10px] font-mono font-medium text-[#F5EFE2]/90 shrink-0 w-6 text-right select-none">
              {percentage}%
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
