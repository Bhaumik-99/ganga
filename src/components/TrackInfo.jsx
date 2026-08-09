export default function TrackInfo({ title, artist }) {
  return (
    <div className="flex flex-col justify-center min-w-0 gap-0.5">
      <p
        className="text-sm md:text-[14px] font-medium truncate"
        style={{ color: 'var(--color-cream)' }}
        title={title}
      >
        {title}
      </p>
      <p
        className="text-[11px] md:text-xs truncate"
        style={{ color: 'var(--color-cream-dim)' }}
      >
        {artist}
      </p>
    </div>
  );
}
