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
  logout,
} from '../services/spotify';
import { SPOTIFY_CONFIG } from '../config/spotify';

export function useSpotifyPlayer() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [deviceId, setDeviceId] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState({
    title: 'Mujhse Mohabbat Ka Izhaar Karta',
    artist: 'Satrang Music Official',
    artwork: '/images/ChatGPT%20Image%20Aug%2010,%202026,%2012_09_56%20AM.png',
  });
  const [error, setError] = useState(null);
  const [playlistUri, setPlaylistUri] = useState(null);

  const playerRef = useRef(null);

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
        setPlaylistUri(data.uri);
        if (data.tracks && data.tracks.length > 0 && !currentTrack.title) {
          setCurrentTrack(data.tracks[0]);
        }
      })
      .catch((err) => {
        console.warn('Failed to load Spotify playlist:', err);
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

          // Transfer playback to Web Player
          try {
            await transferPlayback(device_id, false);
          } catch (e) {
            console.warn('Transfer playback warning:', e);
          }
        });

        player.addListener('not_ready', ({ device_id }) => {
          console.warn('Device ID has gone offline:', device_id);
          setIsReady(false);
        });

        player.addListener('player_state_changed', (state) => {
          if (!state) return;

          const track = state.track_window.current_track;
          if (track) {
            setCurrentTrack({
              id: track.id,
              uri: track.uri,
              title: track.name,
              artist: track.artists.map((a) => a.name).join(', '),
              artwork: track.album.images[0]?.url || '/images/ChatGPT%20Image%20Aug%2010,%202026,%2012_09_56%20AM.png',
            });
          }

          setIsPlaying(!state.paused);
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
          setError('Spotify playback error occurred.');
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

    if (isPlaying) {
      await pausePlayback();
      setIsPlaying(false);
    } else {
      if (deviceId && playlistUri) {
        await playTrack(deviceId, playlistUri);
        setIsPlaying(true);
      } else {
        await playTrack(deviceId);
        setIsPlaying(true);
      }
    }
  }, [isAuthenticated, isPlaying, deviceId, playlistUri, connect]);

  const next = useCallback(async () => {
    if (!isAuthenticated) return;
    await nextTrack();
  }, [isAuthenticated]);

  const prev = useCallback(async () => {
    if (!isAuthenticated) return;
    await previousTrack();
  }, [isAuthenticated]);

  return {
    isAuthenticated,
    isReady,
    isPlaying,
    currentTrack,
    error,
    connect,
    togglePlay,
    next,
    prev,
  };
}
