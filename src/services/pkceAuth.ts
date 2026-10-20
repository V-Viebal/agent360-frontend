// Standard browser PKCE (Proof Key for Code Exchange) implementation for SPA OIDC
import { clearAllSessionState, getStoredToken } from "./sessionStorageHelpers";

export function generateRandomString(length = 64): string {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
  const array = new Uint8Array(length);
  window.crypto.getRandomValues(array);
  return Array.from(array, (x) => charset[x % charset.length]).join('');
}

export async function generateCodeChallenge(codeVerifier: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);
  const digest = await window.crypto.subtle.digest('SHA-256', data);
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

export async function initiateSkyerSignIn(
  authConfig: {
    endpoint: string;
    appId: string;
    localAppId: string;
    apiResource: string;
    apiScopes?: string[];
    redirectUri: string;
    postLogoutRedirectUri: string;
  },
  mode: 'signIn' | 'signUp' = 'signIn'
) {
  const isLocal = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
  const clientId = isLocal ? authConfig.localAppId : authConfig.appId;
  const redirect = isLocal ? 'http://localhost:3000/callback' : authConfig.redirectUri;

  const codeVerifier = generateRandomString(64);
  const codeChallenge = await generateCodeChallenge(codeVerifier);
  const state = generateRandomString(32);

  // Store PKCE verifier and state in sessionStorage
  sessionStorage.setItem('skyer_oidc_verifier', codeVerifier);
  sessionStorage.setItem('skyer_oidc_state', state);

  const url = new URL('/oidc/auth', authConfig.endpoint);
  url.searchParams.set('client_id', clientId);
  url.searchParams.set('redirect_uri', redirect);
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('scope', ['openid', 'profile', 'email', 'offline_access', ...(authConfig.apiScopes ?? [])].join(' '));
  url.searchParams.set('code_challenge', codeChallenge);
  url.searchParams.set('code_challenge_method', 'S256');
  url.searchParams.set('state', state);
  url.searchParams.set('resource', authConfig.apiResource);
  if (mode === 'signUp') {
    url.searchParams.set('interaction_mode', 'signUp');
  }

  window.location.href = url.toString();
}

export function initiateSkyerSignOut(authConfig: {
  endpoint: string;
  postLogoutRedirectUri: string;
}) {
  const idToken = getStoredToken("skyer_id_token");
  clearAllSessionState();

  const endSessionUrl = new URL("/oidc/session/end", authConfig.endpoint);
  endSessionUrl.searchParams.set("post_logout_redirect_uri", authConfig.postLogoutRedirectUri);
  if (idToken) {
    endSessionUrl.searchParams.set("id_token_hint", idToken);
  }

  window.location.href = endSessionUrl.toString();
}

export async function initiatePasswordReset(authConfig: {
  endpoint: string;
  appId: string;
  localAppId: string;
  apiResource: string;
  apiScopes?: string[];
  redirectUri: string;
}) {
  const isLocal = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
  const clientId = isLocal ? authConfig.localAppId : authConfig.appId;
  const redirect = isLocal ? 'http://localhost:3000/callback' : authConfig.redirectUri;

  const codeVerifier = generateRandomString(64);
  const codeChallenge = await generateCodeChallenge(codeVerifier);
  const state = generateRandomString(32);

  sessionStorage.setItem('skyer_oidc_verifier', codeVerifier);
  sessionStorage.setItem('skyer_oidc_state', state);

  const url = new URL('/oidc/auth', authConfig.endpoint);
  url.searchParams.set('client_id', clientId);
  url.searchParams.set('redirect_uri', redirect);
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('scope', ['openid', 'profile', 'email', 'offline_access', ...(authConfig.apiScopes ?? [])].join(' '));
  url.searchParams.set('code_challenge', codeChallenge);
  url.searchParams.set('code_challenge_method', 'S256');
  url.searchParams.set('state', state);
  url.searchParams.set('resource', authConfig.apiResource);
  url.searchParams.set('first_screen', 'reset_password');

  window.location.href = url.toString();
}
