import { useState } from 'react';
import { X } from 'lucide-react';

const DEFAULT_SPOTIFY_PLAYLIST =
  'https://open.spotify.com/embed/playlist/5dOAUCQfVbge7lodjgUGXq?utm_source=generator&theme=0';

function getSpotifyEmbedUrl(inputUrl) {
  if (!inputUrl) return DEFAULT_SPOTIFY_PLAYLIST;

  const match = inputUrl.match(/spotify\.com\/(track|playlist|album|episode)\/([a-zA-Z0-9]+)/);
  if (match) {
    const [, type, id] = match;
    return `https://open.spotify.com/embed/${type}/${id}?utm_source=generator&theme=0`;
  }

  if (inputUrl.includes('open.spotify.com/embed')) return inputUrl;

  return DEFAULT_SPOTIFY_PLAYLIST;
}

export default function SpotifyDrawer({ isOpen, onClose }) {
  const [urlInput, setUrlInput] = useState('');
  const [embedUrl, setEmbedUrl] = useState(DEFAULT_SPOTIFY_PLAYLIST);

  if (!isOpen) return null;

  const isPlaylistOrAlbum = embedUrl.includes('/playlist/') || embedUrl.includes('/album/');

  const handleLoadUrl = (e) => {
    e.preventDefault();
    if (!urlInput.trim()) return;
    const parsed = getSpotifyEmbedUrl(urlInput);
    setEmbedUrl(parsed);
  };

  return (
    <div className="absolute bottom-full left-0 right-0 mb-3 p-4 rounded-3xl bg-[#1e1009]/95 backdrop-blur-xl border border-white/10 shadow-2xl z-50 text-[#f5f0e8] animate-fade-up">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/10">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 fill-[#1DB954]" viewBox="0 0 24 24">
            <path d="M12 0C5.376 0 0 5.376 0 12s5.376 12 12 12 12-5.376 12-12S18.624 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.899 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.019zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141 4.38-1.32 9.84-.66 13.56 1.62.36.18.54.78.18 1.201zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.18-1.2-.18-1.38-.72-.18-.6.18-1.2.72-1.38 4.26-1.26 11.28-1.02 15.72 1.62.54.3.72 1.02.42 1.56-.3.42-1.02.6-1.56.3z" />
          </svg>
          <span className="text-sm font-medium tracking-wide">Spotify Playlist</span>
        </div>

        <button
          onClick={onClose}
          className="p-1 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-all"
          aria-label="Close Spotify Player"
        >
          <X size={16} />
        </button>
      </div>

      {/* URL Input Form */}
      <form onSubmit={handleLoadUrl} className="flex gap-2 mb-3">
        <input
          type="text"
          placeholder="Paste Spotify track, playlist, or album link..."
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          className="flex-1 px-3 py-1.5 text-xs bg-white/5 rounded-xl border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-[#1DB954] transition-all"
        />
        <button
          type="submit"
          className="px-3 py-1.5 text-xs font-medium bg-[#1DB954] hover:bg-[#1ed760] text-black rounded-xl transition-all shadow-md active:scale-95"
        >
          Play
        </button>
      </form>

      {/* Spotify Embed iFrame */}
      <div className="rounded-2xl overflow-hidden border border-white/10 bg-black/40">
        <iframe
          src={embedUrl}
          width="100%"
          height={isPlaylistOrAlbum ? '352' : '152'}
          frameBorder="0"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
          className="rounded-2xl transition-all duration-300"
          title="Spotify Embed Player"
        />
      </div>
    </div>
  );
}
