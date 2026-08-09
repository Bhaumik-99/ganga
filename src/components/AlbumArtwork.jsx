export default function AlbumArtwork({ src, alt, isPlaying }) {
  return (
    <div className="shrink-0 relative flex items-center justify-center">
      {/* Vinyl Disc Container */}
      <div
        className={`relative rounded-full overflow-hidden transition-all duration-500 ${
          isPlaying ? 'animate-spin-slow shadow-[0_0_20px_rgba(29,185,84,0.4)] border-2 border-[#1DB954]' : 'animate-spin-slow paused border border-white/20 shadow-lg'
        }`}
        style={{
          width: 'clamp(44px, 8vw, 68px)',
          height: 'clamp(44px, 8vw, 68px)',
        }}
      >
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.parentElement.style.background =
              'linear-gradient(135deg, rgba(139,55,35,0.9), rgba(60,25,12,0.95))';
          }}
        />

        {/* Center Vinyl Spindle Hole */}
        <div className="absolute inset-0 m-auto w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#140a05] border border-white/30 shadow-inner flex items-center justify-center">
          <div className="w-1 h-1 rounded-full bg-white/40" />
        </div>
      </div>
    </div>
  );
}
