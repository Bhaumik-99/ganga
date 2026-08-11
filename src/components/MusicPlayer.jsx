import AlbumArtwork from './AlbumArtwork';
import TrackInfo from './TrackInfo';
import PlayerControls from './PlayerControls';
import VolumeControl from './VolumeControl';
import ProgressBar from './ProgressBar';
import { useSpotifyPlayer } from '../hooks/useSpotifyPlayer';
import { useAudioPlayer } from '../hooks/useAudioPlayer';
import { playlist } from '../data/playlist';

export default function MusicPlayer() {
  const spotifyPlayer = useSpotifyPlayer();
  const audioPlayer = useAudioPlayer(playlist);

  // Use Spotify player if authenticated, otherwise native audio player
  const activePlayer = spotifyPlayer.isAuthenticated ? spotifyPlayer : audioPlayer;

  return (
    /* Outer container: Fixed 100% width flexbox wrapper guarantees horizontal centering on mobile & desktop */
    <div className="fixed bottom-3 sm:bottom-6 md:bottom-8 left-0 right-0 z-[100] flex items-center justify-center pointer-events-none px-2.5 sm:px-4 pb-[env(safe-area-inset-bottom,0px)]">
      {/* Inner player card */}
      <div
        className={`pointer-events-auto animate-slide-up flex flex-col items-center backdrop-blur-2xl transition-all duration-300 overflow-hidden ${
          activePlayer.isPlaying ? 'animate-float' : ''
        }`}
        style={{
          width: 'clamp(320px, 94vw, 680px)',
          borderRadius: '26px',
          background:
            'linear-gradient(135deg, rgba(42, 19, 11, 0.94), rgba(22, 10, 5, 0.97))',
          border: '1px solid rgba(255, 235, 210, 0.15)',
          boxShadow:
            '0 24px 50px rgba(8, 3, 1, 0.8), 0 4px 12px rgba(0, 0, 0, 0.5), inset 0 1px 1px rgba(255, 245, 235, 0.14)',
          fontFamily: 'var(--font-ui)',
        }}
      >
        {/* Unobtrusive error message */}
        {spotifyPlayer.error && (
          <div className="w-full px-4 py-1.5 bg-red-950/90 rounded-t-[26px] border-b border-red-500/20 text-center text-[10px] sm:text-[11px] text-red-200/90 tracking-wide">
            {spotifyPlayer.error}
          </div>
        )}

        {/* Main player bar top content */}
        <div className="w-full flex items-center justify-between gap-3 sm:gap-4 px-4 sm:px-7 pt-3 sm:pt-4 pb-2">
          {/* Left: Album artwork */}
          <div className="shrink-0 flex items-center justify-center">
            <AlbumArtwork
              src={activePlayer.currentTrack.artwork}
              alt={activePlayer.currentTrack.title}
              isPlaying={activePlayer.isPlaying}
            />
          </div>

          {/* Center: Track info (title & artist) */}
          <div className="flex-1 min-w-0 flex flex-col justify-center px-0.5">
            <TrackInfo
              title={activePlayer.currentTrack.title}
              artist={activePlayer.currentTrack.artist}
              isPlaying={activePlayer.isPlaying}
            />
          </div>

          {/* Right: Controls & Volume Control */}
          <div className="shrink-0 flex items-center gap-2 sm:gap-3.5">
            <PlayerControls
              isPlaying={activePlayer.isPlaying}
              onToggle={activePlayer.togglePlay || activePlayer.toggle}
              onPrev={activePlayer.prev}
              onNext={activePlayer.next}
            />

            {/* Vertical Separator */}
            <div className="w-[1px] h-5 bg-white/10 shrink-0 hidden sm:block" />

            {/* UX Researched Expandable Volume Control */}
            <VolumeControl
              volume={activePlayer.volume}
              isMuted={activePlayer.isMuted}
              onVolumeChange={activePlayer.setVolume}
              onToggleMute={activePlayer.toggleMute}
            />
          </div>
        </div>

        {/* Bottom Timeline Seek Slider Row (Safely inset with generous side padding) */}
        <div className="w-full px-8 sm:px-14 md:px-16 pt-1 pb-3 sm:pb-4 flex justify-center">
          <div className="w-full max-w-[560px] pt-1.5 border-t border-white/10">
            <ProgressBar
              currentTime={activePlayer.currentTime}
              duration={activePlayer.duration}
              onSeek={activePlayer.seek}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

