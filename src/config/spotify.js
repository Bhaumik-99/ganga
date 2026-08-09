export function extractPlaylistId(input = '') {
  if (!input) return '5dOAUCQfVbge7lodjgUGXq';
  const match = input.match(/(?:playlist\/|playlist:|^)([a-zA-Z0-9]{22})/);
  return match ? match[1] : input.trim();
}

const rawPlaylistId = import.meta.env.VITE_SPOTIFY_PLAYLIST_ID || '5dOAUCQfVbge7lodjgUGXq';

export const SPOTIFY_CONFIG = {
  clientId: import.meta.env.VITE_SPOTIFY_CLIENT_ID || '',
  redirectUri: import.meta.env.VITE_SPOTIFY_REDIRECT_URI || `${window.location.origin}/callback`,
  playlistId: extractPlaylistId(rawPlaylistId),
  scopes: [
    'streaming',
    'user-read-email',
    'user-read-private',
    'user-modify-playback-state',
    'user-read-playback-state',
    'playlist-read-private',
    'playlist-read-collaborative',
  ].join(' '),
};

// PKCE Helper: Generate Random Verifier
export function generateCodeVerifier(length = 64) {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
  const values = crypto.getRandomValues(new Uint8Array(length));
  return values.reduce((acc, x) => acc + possible[x % possible.length], '');
}

// PKCE Helper: Generate SHA-256 Code Challenge
export async function generateCodeChallenge(codeVerifier) {
  const data = new TextEncoder().encode(codeVerifier);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}
