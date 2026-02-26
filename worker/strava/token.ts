// トークン交換 + リフレッシュ
import type { Env } from '../env';
import { STRAVA_TOKEN_URL, REFRESH_BUFFER } from './constants';
import type { SessionData } from './session';
import { saveSession } from './session';

interface TokenResponse {
  access_token: string;
  refresh_token: string;
  expires_at: number;
  athlete: { id: number };
}

// 認可コード → トークン交換
export async function exchangeCode(env: Env, code: string): Promise<TokenResponse> {
  const res = await fetch(STRAVA_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: env.CLIENT_ID,
      client_secret: env.CLIENT_SECRET,
      code,
      grant_type: 'authorization_code',
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error('[token] Exchange failed:', res.status, text);
    throw new Error(`Token exchange failed: ${res.status} ${text}`);
  }

  return res.json() as Promise<TokenResponse>;
}

// アクセストークンが期限切れ（またはバッファ内）なら自動リフレッシュ
export async function ensureFreshToken(
  env: Env,
  sessionId: string,
  session: SessionData,
): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  if (session.expiresAt - now > REFRESH_BUFFER) {
    return session.accessToken;
  }

  const res = await fetch(STRAVA_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: env.CLIENT_ID,
      client_secret: env.CLIENT_SECRET,
      refresh_token: session.refreshToken,
      grant_type: 'refresh_token',
    }),
  });

  if (!res.ok) {
    throw new Error(`Token refresh failed: ${res.status}`);
  }

  const data = (await res.json()) as TokenResponse;
  const updated: SessionData = {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresAt: data.expires_at,
    athleteId: session.athleteId,
  };

  await saveSession(env, sessionId, updated);
  return updated.accessToken;
}
