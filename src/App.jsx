import { useState, useEffect } from 'react';
import LoadingScreen from './components/LoadingScreen';
import TopStatusBar from './components/TopStatusBar';
import HeroTypography from './components/HeroTypography';
import MusicPlayer from './components/MusicPlayer';
import AmbientEffects from './components/AmbientEffects';
import SpotifyCallback from './pages/SpotifyCallback';

const BG_IMAGE_URL = '/images/ChatGPT%20Image%20Aug%2010,%202026,%2012_09_56%20AM.png';

export default function App() {
  const [bgLoaded, setBgLoaded] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Preload background image
    const img = new Image();
    img.src = BG_IMAGE_URL;
    img.onload = () => setBgLoaded(true);
    img.onerror = () => setBgLoaded(true);
  }, []);

  // Handle Spotify OAuth Callback Route (/callback)
  if (window.location.pathname === '/callback') {
    return <SpotifyCallback />;
  }

  return (
    <>
      {/* Cinematic Loading Screen Preloader */}
      <LoadingScreen isLoaded={bgLoaded} onFinish={() => setShowContent(true)} />

      <div
        className={`relative w-full h-screen h-[100dvh] overflow-hidden bg-[#1a0e08] transition-opacity duration-700 ${
          showContent ? 'animate-bg-zoom opacity-100' : 'opacity-0'
        }`}
        style={{
          backgroundImage: `url(${BG_IMAGE_URL})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {/* Ambient overlays */}
        <AmbientEffects />

        {/* Top status bar */}
        {showContent && <TopStatusBar />}

        {/* Hero Hindi typography */}
        {showContent && <HeroTypography />}

        {/* Floating music player */}
        {showContent && <MusicPlayer />}
      </div>
    </>
  );
}
