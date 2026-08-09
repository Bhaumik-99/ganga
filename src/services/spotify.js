import { SPOTIFY_CONFIG, generateCodeVerifier, generateCodeChallenge } from '../config/spotify';

const TOKEN_KEY = 'spotify_access_token';
const REFRESH_KEY = 'spotify_refresh_token';
const EXPIRES_AT_KEY = 'spotify_expires_at';
const VERIFIER_KEY = 'spotify_code_verifier';

// 1. Start PKCE OAuth Flow
export async function redirectToSpotifyAuth() {
  if (!SPOTIFY_CONFIG.clientId) {
    console.error('Missing VITE_SPOTIFY_CLIENT_ID in environment variables.');
    alert('Please configure VITE_SPOTIFY_CLIENT_ID in your .env file.');
    return;
  }

  const verifier = generateCodeVerifier();
  const challenge = await generateCodeChallenge(verifier);

  sessionStorage.setItem(VERIFIER_KEY, verifier);

  const params = new URLSearchParams({
    client_id: SPOTIFY_CONFIG.clientId,
    response_type: 'code',
    redirect_uri: SPOTIFY_CONFIG.redirectUri,
    scope: SPOTIFY_CONFIG.scopes,
    code_challenge_method: 'S256',
    code_challenge: challenge,
  });

  window.location.href = `https://accounts.spotify.com/authorize?${params.toString()}`;
}

// 2. Exchange authorization code for access token (PKCE)
export async function handleAuthCallback(code) {
  const verifier = sessionStorage.getItem(VERIFIER_KEY);
  if (!verifier) {
    throw new Error('Code verifier not found in session storage.');
  }

  const body = new URLSearchParams({
    client_id: SPOTIFY_CONFIG.clientId,
    grant_type: 'authorization_code',
    code,
    redirect_uri: SPOTIFY_CONFIG.redirectUri,
    code_verifier: verifier,
  });

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error_description || 'Failed to exchange authorization code');
  }

  const data = await response.json();

  saveTokens(data);
  sessionStorage.removeItem(VERIFIER_KEY);
  return data.access_token;
}

// 3. Refresh Access Token
export async function refreshAccessToken() {
  const refreshToken = localStorage.getItem(REFRESH_KEY);
  if (!refreshToken || !SPOTIFY_CONFIG.clientId) return null;

  const body = new URLSearchParams({
    client_id: SPOTIFY_CONFIG.clientId,
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
  });

  try {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    });

    if (!response.ok) {
      logout();
      return null;
    }

    const data = await response.json();
    saveTokens(data);
    return data.access_token;
  } catch {
    logout();
    return null;
  }
}

// Save tokens helper
function saveTokens(data) {
  if (data.access_token) localStorage.setItem(TOKEN_KEY, data.access_token);
  if (data.refresh_token) localStorage.setItem(REFRESH_KEY, data.refresh_token);
  if (data.expires_in) {
    const expiresAt = Date.now() + data.expires_in * 1000;
    localStorage.setItem(EXPIRES_AT_KEY, expiresAt.toString());
  }
}

// 4. Get valid Access Token
export async function getAccessToken() {
  const token = localStorage.getItem(TOKEN_KEY);
  const expiresAt = localStorage.getItem(EXPIRES_AT_KEY);

  if (!token || !expiresAt) return null;

  // Refresh 60 seconds before expiration
  if (Date.now() > Number(expiresAt) - 60000) {
    return await refreshAccessToken();
  }

  return token;
}

// 5. Logout
export function logout() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_KEY);
  localStorage.removeItem(EXPIRES_AT_KEY);
  sessionStorage.removeItem(VERIFIER_KEY);
}

// Helper for authenticated fetch
async function spotifyFetch(endpoint, options = {}) {
  const token = await getAccessToken();
  if (!token) throw new Error('Unauthenticated');

  const res = await fetch(`https://api.spotify.com/v1${endpoint}`, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (res.status === 401) {
    const newToken = await refreshAccessToken();
    if (!newToken) throw new Error('Authentication expired');

    return await fetch(`https://api.spotify.com/v1${endpoint}`, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${newToken}`,
        'Content-Type': 'application/json',
      },
    });
  }

  return res;
}

// 6. Get Playlist Tracks
export async function getPlaylistDetails(playlistId = SPOTIFY_CONFIG.playlistId) {
  const res = await spotifyFetch(`/playlists/${playlistId}`);
  if (!res.ok) throw new Error('Failed to fetch playlist');
  const data = await res.json();

  const tracks = data.tracks.items
    .filter((item) => item && item.track)
    .map((item) => ({
      id: item.track.id,
      uri: item.track.uri,
      title: item.track.name,
      artist: item.track.artists.map((a) => a.name).join(', '),
      artwork: item.track.album.images[0]?.url || '/images/ChatGPT%20Image%20Aug%2010,%202026,%2012_09_56%20AM.png',
    }));

  return {
    id: data.id,
    name: data.name,
    uri: data.uri,
    tracks,
  };
}

// 7. Transfer Playback to Web Playback SDK Device
export async function transferPlayback(deviceId, play = true) {
  const res = await spotifyFetch('/me/player', {
    method: 'PUT',
    body: JSON.stringify({
      device_ids: [deviceId],
      play,
    }),
  });

  return res.ok || res.status === 204;
}

// 8. Play Track / Playlist
export async function playTrack(deviceId, playlistUri, position = 0) {
  const body = playlistUri
    ? { context_uri: playlistUri, offset: { position } }
    : undefined;

  const endpoint = deviceId ? `/me/player/play?device_id=${deviceId}` : '/me/player/play';
  const res = await spotifyFetch(endpoint, {
    method: 'PUT',
    body: body ? JSON.stringify(body) : undefined,
  });

  return res.ok || res.status === 204;
}

// 9. Pause Playback
export async function pausePlayback() {
  const res = await spotifyFetch('/me/player/pause', { method: 'PUT' });
  return res.ok || res.status === 204;
}

// 10. Next Track
export async function nextTrack() {
  const res = await spotifyFetch('/me/player/next', { method: 'POST' });
  return res.ok || res.status === 204;
}

// 11. Previous Track
export async function previousTrack() {
  const res = await spotifyFetch('/me/player/previous', { method: 'POST' });
  return res.ok || res.status === 204;
}

// 12. Get Playback State
export async function getPlaybackState() {
  const res = await spotifyFetch('/me/player');
  if (res.status === 204 || !res.ok) return null;
  return await res.json();
}
