// セッション管理（httpOnly Cookie + KV）
import type { Env } from '../env';
import { SESSION_TTL } from './constants';
import { json, errorResponse } from '../utils/response';

export interface SessionData {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  athleteId: number;
}

export function createSessionCookie(sessionId: string): string {
  return `strava_session=${sessionId}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${SESSION_TTL}`;
}

export function clearSessionCookie(): string {
  return 'strava_session=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0';
}

export function getSessionId(request: Request): string | null {
  const cookie = request.headers.get('Cookie');
  if (!cookie) return null;
  const match = cookie.match(/strava_session=([^;]+)/);
  return match ? match[1] : null;
}

export async function getSession(request: Request, env: Env): Promise<SessionData | null> {
  const sessionId = getSessionId(request);
  if (!sessionId) return null;
  return env.STRAVA_KV.get<SessionData>(`session:${sessionId}`, 'json');
}

export async function saveSession(env: Env, sessionId: string, data: SessionData): Promise<void> {
  await env.STRAVA_KV.put(`session:${sessionId}`, JSON.stringify(data), {
    expirationTtl: SESSION_TTL,
  });
}

// GET /api/strava/status — セッション有無を返却（トークン非露出）
export async function handleStatus(request: Request, env: Env): Promise<Response> {
  if (request.method !== 'GET') return errorResponse('Method not allowed', 405);

  const session = await getSession(request, env);
  if (!session) {
    return json({ authenticated: false });
  }
  return json({ authenticated: true, athleteId: session.athleteId });
}
