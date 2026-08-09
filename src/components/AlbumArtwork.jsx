export default function AlbumArtwork({ src, alt, isPlaying }) {
  return (
    <div className="shrink-0">
      <div
        className={`rounded-full overflow-hidden border border-white/10 shadow-lg ${
          isPlaying ? 'animate-spin-slow' : 'animate-spin-slow paused'
        }`}
        style={{
          width: 'clamp(48px, 8vw, 70px)',
          height: 'clamp(48px, 8vw, 70px)',
        }}
      >
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
          onError={(e) => {
            // Fallback gradient if image missing
            e.target.style.display = 'none';
            e.target.parentElement.style.background =
              'linear-gradient(135deg, rgba(139,55,35,0.8), rgba(80,40,25,0.9))';
          }}
        />
      </div>
    </div>
  );
}
