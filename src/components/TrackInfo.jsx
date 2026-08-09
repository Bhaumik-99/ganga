export default function TrackInfo({ title, artist, isPlaying }) {
  return (
    <div className="flex flex-col justify-center min-w-0 gap-0.5 select-none">
      {/* Title */}
      <div className="flex items-center gap-2 min-w-0">
        <p
          className="text-sm md:text-[15px] font-semibold tracking-wide truncate text-[#F5EFE2] drop-shadow-sm"
          title={title}
        >
          {title}
        </p>

        {/* Animated Equalizer bars when playing */}
        {isPlaying && (
          <div className="shrink-0 flex items-end gap-[2px] h-3.5 px-1">
            <span className="w-[2px] bg-[#1DB954] rounded-full animate-[pulse_0.6s_ease-in-out_infinite] h-full" />
            <span className="w-[2px] bg-[#1DB954] rounded-full animate-[pulse_0.8s_ease-in-out_infinite_0.2s] h-2/3" />
            <span className="w-[2px] bg-[#1DB954] rounded-full animate-[pulse_0.5s_ease-in-out_infinite_0.4s] h-4/5" />
          </div>
        )}
      </div>

      {/* Artist */}
      <p
        className="text-[11px] md:text-xs tracking-wider uppercase font-medium truncate text-[#d8c3aa]/80"
        title={artist}
      >
        {artist}
      </p>
    </div>
  );
}
