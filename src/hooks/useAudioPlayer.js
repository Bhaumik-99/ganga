import { useState, useEffect, useRef, useCallback } from 'react';

export function useAudioPlayer(initialPlaylist) {
  const audioRef = useRef(null);
  const [playlist, setPlaylist] = useState(initialPlaylist);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const currentTrack = playlist[currentIndex] || {
    title: 'No Track Selected',
    artist: 'Add an audio file',
    src: '',
    artwork: '',
  };

  // Initialize audio element
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.volume = 0.8;
      audioRef.current.preload = 'metadata';
    }

    const audio = audioRef.current;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoadedMetadata = () => {
      setDuration(audio.duration);
      setIsLoaded(true);
    };
    const onEnded = () => {
      // Auto-advance to next track
      setCurrentIndex((prev) => (prev + 1) % playlist.length);
    };
    const onError = () => {
      console.warn('Audio error — track may be missing or unplayable:', audio.src);
      setIsLoaded(false);
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('error', onError);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('error', onError);
    };
  }, [playlist.length]);

  // Load new track when index or src changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack.src) return;

    const wasPlaying = isPlaying;
    setIsLoaded(false);
    setCurrentTime(0);
    setDuration(0);

    audio.src = currentTrack.src;
    audio.load();

    if (wasPlaying) {
      audio.play().catch(() => {});
    }
  }, [currentIndex, currentTrack.src]);

  // Add custom local track
  const addTrack = useCallback(
    (file) => {
      if (!file) return;
      const objectUrl = URL.createObjectURL(file);
      const newTrack = {
        id: Date.now(),
        title: file.name.replace(/\.[^/.]+$/, ''),
        artist: 'My Uploaded Track',
        src: objectUrl,
        artwork: playlist[0]?.artwork || '/images/ChatGPT%20Image%20Aug%2010,%202026,%2012_09_56%20AM.png',
      };
      setPlaylist((prev) => [...prev, newTrack]);
      setCurrentIndex(playlist.length);
      setIsPlaying(true);
    },
    [playlist]
  );

  // Play
  const play = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack.src) return;

    audio
      .play()
      .then(() => setIsPlaying(true))
      .catch((err) => console.warn('Play failed:', err));
  }, [currentTrack.src]);

  // Pause
  const pause = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.pause();
    setIsPlaying(false);
  }, []);

  // Toggle play/pause
  const toggle = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, play, pause]);

  // Next track
  const next = useCallback(() => {
    if (playlist.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % playlist.length);
  }, [playlist.length]);

  // Previous track
  const prev = useCallback(() => {
    if (playlist.length === 0) return;
    const audio = audioRef.current;
    if (audio && audio.currentTime > 3) {
      audio.currentTime = 0;
      return;
    }
    setCurrentIndex((prev) => (prev - 1 + playlist.length) % playlist.length);
  }, [playlist.length]);

  // Seek to position (0–1)
  const seek = useCallback(
    (fraction) => {
      const audio = audioRef.current;
      if (!audio || !duration) return;

      audio.currentTime = fraction * duration;
      setCurrentTime(audio.currentTime);
    },
    [duration]
  );

  // Set volume (0–1)
  const setVolume = useCallback(
    (val) => {
      const audio = audioRef.current;
      if (!audio) return;

      const clamped = Math.max(0, Math.min(1, val));
      audio.volume = clamped;
      setVolumeState(clamped);

      if (clamped > 0 && isMuted) {
        audio.muted = false;
        setIsMuted(false);
      }
    },
    [isMuted]
  );

  // Toggle mute
  const toggleMute = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.muted = !audio.muted;
    setIsMuted(audio.muted);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          toggle();
          break;
        case 'ArrowRight':
          e.preventDefault();
          if (audioRef.current) {
            audioRef.current.currentTime = Math.min(audioRef.current.currentTime + 5, duration);
          }
          break;
        case 'ArrowLeft':
          e.preventDefault();
          if (audioRef.current) {
            audioRef.current.currentTime = Math.max(audioRef.current.currentTime - 5, 0);
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggle, duration]);

  return {
    playlist,
    currentTrack,
    currentIndex,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    isLoaded,
    addTrack,
    play,
    pause,
    toggle,
    next,
    prev,
    seek,
    setVolume,
    toggleMute,
  };
}
