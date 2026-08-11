import { useState, useEffect, useRef, useCallback } from 'react';
import {
  getAccessToken,
  redirectToSpotifyAuth,
  getPlaylistDetails,
  transferPlayback,
  playTrack,
  pausePlayback,
  nextTrack,
  previousTrack,
  setRepeatMode,
  setSpotifyVolume,
  seekPlayback,
  logout,
} from '../services/spotify';
import { SPOTIFY_CONFIG } from '../config/spotify';

export function useSpotifyPlayer() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [deviceId, setDeviceId] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [prevVolume, setPrevVolume] = useState(0.8);
  const [currentTrack, setCurrentTrack] = useState({
    title: 'Ganga Music Experience',
    artist: 'Connect Spotify to start playback',
    artwork: '/images/ChatGPT%20Image%20Aug%2010,%202026,%2012_09_56%20AM.png',
  });
  const [error, setError] = useState(null);
  const [playlistUri, setPlaylistUri] = useState(`spotify:playlist:${SPOTIFY_CONFIG.playlistId}`);
  const [trackUris, setTrackUris] = useState([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const playerRef = useRef(null);
  const trackUrisRef = useRef([]);
  const playlistUriRef = useRef(`spotify:playlist:${SPOTIFY_CONFIG.playlistId}`);

  useEffect(() => {
    trackUrisRef.current = trackUris;
  }, [trackUris]);

  useEffect(() => {
    playlistUriRef.current = playlistUri;
  }, [playlistUri]);

  // Check auth status on mount
  useEffect(() => {
    getAccessToken().then((token) => {
      setIsAuthenticated(!!token);
    });
  }, []);

  // Fetch configured playlist metadata
  useEffect(() => {
    if (!isAuthenticated) return;

    getPlaylistDetails(SPOTIFY_CONFIG.playlistId)
      .then((data) => {
        if (data.uri) setPlaylistUri(data.uri);
        if (data.tracks && data.tracks.length > 0) {
          setCurrentTrack(data.tracks[0]);
          setTrackUris(data.tracks.map((t) => t.uri));
        }
      })
      .catch((err) => {
        console.warn('Failed to load Spotify playlist metadata:', err);
        setError('Playlist not found or private. Ensure playlist is Public on Spotify.');
      });
  }, [isAuthenticated]);

  // Load Spotify Web Playback SDK
  useEffect(() => {
    if (!isAuthenticated) return;

    let playerInstance = null;

    const initializeSDK = async () => {
      const token = await getAccessToken();
      if (!token) return;

      window.onSpotifyWebPlaybackSDKReady = () => {
        const player = new window.Spotify.Player({
          name: 'Ganga Web Player',
          getOAuthToken: (cb) => {
            getAccessToken().then((t) => cb(t || ''));
          },
          volume: 0.8,
        });

        playerRef.current = player;
        playerInstance = player;

        // SDK Event Handlers
        player.addListener('ready', async ({ device_id }) => {
          setDeviceId(device_id);
          setIsReady(true);
          setError(null);

          // Initial playback transfer to Web Player
          try {
            await transferPlayback(device_id, false);
            await setRepeatMode('context');
          } catch (e) {
            console.warn('Transfer playback warning:', e);
          }
        });

        player.addListener('not_ready', ({ device_id }) => {
          console.warn('Device ID has gone offline:', device_id);
          setIsReady(false);
        });

        player.addListener('player_state_changed', async (state) => {
          if (!state) return;

          const track = state.track_window.current_track;
          if (track) {
            setCurrentTrack({
              id: track.id,
              uri: track.uri,
              title: track.name,
              artist: track.artists.map((a) => a.name).join(', '),
              artwork:
                track.album.images[0]?.url ||
                '/images/ChatGPT%20Image%20Aug%2010,%202026,%2012_09_56%20AM.png',
            });

            // Strict Playlist Enforcer: If Spotify attempts to play a track outside your playlist,
            // force-restart playback back to Track #1 of your playlist
            if (
              trackUrisRef.current &&
              trackUrisRef.current.length > 0 &&
              !trackUrisRef.current.includes(track.uri)
            ) {
              console.warn('Detected non-playlist track. Force resetting playback to playlist...');
              try {
                await playTrack(device_id, playlistUriRef.current, trackUrisRef.current);
              } catch (e) {
                console.warn('Strict playlist reset warning:', e);
              }
              return;
            }
          }

          setIsPlaying(!state.paused);
          if (typeof state.position === 'number') setCurrentTime(state.position / 1000);
          if (typeof state.duration === 'number') setDuration(state.duration / 1000);
        });

        player.addListener('initialization_error', ({ message }) => {
          console.error('Spotify Init Error:', message);
          setError('Failed to initialize Spotify Web Player.');
        });

        player.addListener('authentication_error', ({ message }) => {
          console.error('Spotify Auth Error:', message);
          setError('Spotify session expired. Please reconnect.');
          logout();
          setIsAuthenticated(false);
        });

        player.addListener('account_error', ({ message }) => {
          console.error('Spotify Account Error:', message);
          setError('Spotify Premium account required for Web Playback SDK.');
        });

        player.addListener('playback_error', ({ message }) => {
          console.error('Spotify Playback Error:', message);
          setError('Spotify playback error occurred. Ensure Spotify Premium & active session.');
        });

        player.connect();
      };

      // Load SDK script if not already present
      if (!document.getElementById('spotify-sdk')) {
        const script = document.createElement('script');
        script.id = 'spotify-sdk';
        script.src = 'https://sdk.scdn.co/spotify-player.js';
        script.async = true;
        document.body.appendChild(script);
      } else if (window.Spotify) {
        window.onSpotifyWebPlaybackSDKReady();
      }
    };

    initializeSDK();

    return () => {
      if (playerInstance) {
        playerInstance.disconnect();
      }
    };
  }, [isAuthenticated]);

  // Actions
  const connect = useCallback(() => {
    redirectToSpotifyAuth();
  }, []);

  const togglePlay = useCallback(async () => {
    if (!isAuthenticated) {
      connect();
      return;
    }

    try {
      setError(null);
      if (isPlaying) {
        await pausePlayback();
        setIsPlaying(false);
      } else {
        // Seamlessly re-transfer playback back to website Web Player device
        if (deviceId) {
          try {
            await transferPlayback(deviceId, true);
          } catch (e) {
            console.warn('Re-transfer playback before play:', e);
          }
        }

        const targetPlaylist = playlistUri || `spotify:playlist:${SPOTIFY_CONFIG.playlistId}`;
        const ok = await playTrack(deviceId, targetPlaylist, trackUris);
        if (ok) {
          setIsPlaying(true);
        } else {
          setError('Unable to start playback. Check Spotify Premium or device connection.');
        }
      }
    } catch (err) {
      console.error('Toggle play error:', err);
      setError(err.message || 'Failed to control Spotify playback');
    }
  }, [isAuthenticated, isPlaying, deviceId, playlistUri, trackUris, connect]);

  const next = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      if (deviceId) {
        await transferPlayback(deviceId, true);
      }
      await nextTrack();
    } catch (err) {
      console.error('Next track error:', err);
    }
  }, [isAuthenticated, deviceId]);

  const prev = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      if (deviceId) {
        await transferPlayback(deviceId, true);
      }
      await previousTrack();
    } catch (err) {
      console.error('Prev track error:', err);
    }
  }, [isAuthenticated, deviceId]);

  // Volume & Mute Handlers
  const setVolume = useCallback(async (val) => {
    const clamped = Math.max(0, Math.min(1, val));
    setVolumeState(clamped);
    if (clamped > 0) setIsMuted(false);

    if (playerRef.current) {
      try {
        await playerRef.current.setVolume(clamped);
      } catch (e) {
        console.warn('SDK setVolume failed:', e);
      }
    }
    await setSpotifyVolume(clamped * 100);
  }, []);

  const toggleMute = useCallback(async () => {
    if (isMuted) {
      const restored = prevVolume > 0 ? prevVolume : 0.8;
      setIsMuted(false);
      await setVolume(restored);
    } else {
      setPrevVolume(volume);
      setIsMuted(true);
      await setVolume(0);
    }
  }, [isMuted, volume, prevVolume, setVolume]);

  // Continuously update position while playing
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(async () => {
      if (playerRef.current) {
        try {
          const state = await playerRef.current.getCurrentState();
          if (state) {
            setCurrentTime(state.position / 1000);
            setDuration(state.duration / 1000);
          }
        } catch {
          // ignore error if state unavailable
        }
      }
    }, 500);
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Seek position (fraction: 0 - 1)
  const seek = useCallback(
    async (fraction) => {
      if (!duration) return;
      const targetMs = Math.round(fraction * duration * 1000);
      setCurrentTime(targetMs / 1000);

      if (playerRef.current) {
        try {
          await playerRef.current.seek(targetMs);
          return;
        } catch (e) {
          console.warn('SDK seek error:', e);
        }
      }
      await seekPlayback(targetMs);
    },
    [duration]
  );

  return {
    isAuthenticated,
    isReady,
    isPlaying,
    currentTrack,
    volume,
    isMuted,
    error,
    currentTime,
    duration,
    seek,
    connect,
    togglePlay,
    next,
    prev,
    setVolume,
    toggleMute,
  };
}
