import { useEffect, useState } from 'react';
import { handleAuthCallback } from '../services/spotify';

export default function SpotifyCallback() {
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const authError = params.get('error');

    if (authError) {
      setErrorMsg(`Authorization rejected: ${authError}`);
      return;
    }

    if (code) {
      handleAuthCallback(code)
        .then(() => {
          // Return user to main app
          window.location.href = '/';
        })
        .catch((err) => {
          console.error('Spotify callback error:', err);
          setErrorMsg(err.message || 'Failed to authenticate with Spotify');
        });
    } else {
      setErrorMsg('No authorization code returned from Spotify');
    }
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#140a05] text-[#f5f0e8] p-6 font-sans">
      {errorMsg ? (
        <div className="text-center max-w-md bg-red-950/40 border border-red-500/30 p-6 rounded-2xl">
          <h2 className="text-xl font-semibold mb-2 text-red-300">Connection Failed</h2>
          <p className="text-sm text-red-200/80 mb-6">{errorMsg}</p>
          <a
            href="/"
            className="px-5 py-2.5 bg-white/10 hover:bg-white/20 rounded-full text-sm transition-all"
          >
            Return to Homepage
          </a>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-[#1DB954] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm tracking-wide text-white/70">Connecting to Spotify...</p>
        </div>
      )}
    </div>
  );
}
