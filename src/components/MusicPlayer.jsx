import AlbumArtwork from './AlbumArtwork';
import TrackInfo from './TrackInfo';
import PlayerControls from './PlayerControls';
import { useSpotifyPlayer } from '../hooks/useSpotifyPlayer';

export default function MusicPlayer() {
  const {
    isAuthenticated,
    isPlaying,
    currentTrack,
    error,
    connect,
    togglePlay,
    next,
    prev,
  } = useSpotifyPlayer();

  return (
    /* Outer container: Fixed 100% width flexbox wrapper guarantees perfect horizontal centering */
    <div className="fixed bottom-6 md:bottom-8 left-0 right-0 z-40 flex items-center justify-center pointer-events-none px-4">
      {/* Inner player card */}
      <div
        className={`pointer-events-auto animate-slide-up flex flex-col items-center ${
          isPlaying ? 'animate-float' : ''
        }`}
        style={{
          width: 'clamp(340px, 90vw, 620px)',
          borderRadius: 'var(--player-radius)',
          background: 'var(--color-terracotta)',
          backdropFilter: 'blur(var(--player-blur))',
          WebkitBackdropFilter: 'blur(var(--player-blur))',
          border: '1px solid var(--color-border-subtle)',
          boxShadow: '0 8px 32px var(--color-shadow-warm), 0 2px 8px rgba(0,0,0,0.2)',
          fontFamily: 'var(--font-ui)',
        }}
      >
        {/* Unobtrusive error message */}
        {error && (
          <div className="w-full px-5 py-1.5 bg-red-950/70 rounded-t-[60px] border-b border-red-500/20 text-center text-[11px] text-red-200/90 tracking-wide">
            {error}
          </div>
        )}

        {/* Main player bar content */}
        <div className="w-full flex items-center justify-between gap-3 md:gap-5 px-5 md:px-7 py-3 md:py-4">
          {/* Left: Album artwork */}
          <div className="shrink-0 flex items-center justify-center">
            <AlbumArtwork
              src={currentTrack.artwork}
              alt={currentTrack.title}
              isPlaying={isPlaying}
            />
          </div>

          {/* Center: Track info (title & artist) */}
          <div className="flex-1 min-w-0 flex flex-col justify-center px-1">
            <TrackInfo title={currentTrack.title} artist={currentTrack.artist} />
          </div>

          {/* Right: Controls or Connect Spotify */}
          <div className="shrink-0 flex items-center justify-end">
            {!isAuthenticated ? (
              <button
                onClick={connect}
                className="px-4 py-2 text-xs font-semibold rounded-full transition-all duration-200 shadow-md active:scale-95 flex items-center gap-2 bg-[#1DB954] hover:bg-[#1ed760] text-black"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0C5.376 0 0 5.376 0 12s5.376 12 12 12 12-5.376 12-12S18.624 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.899 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.019zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141 4.38-1.32 9.84-.66 13.56 1.62.36.18.54.78.18 1.201zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.18-1.2-.18-1.38-.72-.18-.6.18-1.2.72-1.38 4.26-1.26 11.28-1.02 15.72 1.62.54.3.72 1.02.42 1.56-.3.42-1.02.6-1.56.3z" />
                </svg>
                Connect Spotify
              </button>
            ) : (
              <PlayerControls
                isPlaying={isPlaying}
                onToggle={togglePlay}
                onPrev={prev}
                onNext={next}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
