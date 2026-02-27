// OAuth: /api/strava/auth, /api/strava/callback
import type { Env } from '../env';
import { STRAVA_AUTH_URL, STRAVA_SCOPE, STATE_TTL, SESSION_TTL } from './constants';
import { exchangeCode } from './token';
import { createSessionCookie, saveSession } from './session';
import { errorResponse } from '../utils/response';

// GET /api/strava/auth → Strava 認証画面にリダイレクト
export async function handleAuth(request: Request, env: Env): Promise<Response> {
  if (request.method !== 'GET') return errorResponse('Method not allowed', 405);

  if (!env.CLIENT_ID || !env.CLIENT_SECRET) {
    console.error('[auth] CLIENT_ID or CLIENT_SECRET not configured');
    return errorResponse('OAuth not configured', 500);
  }

  const url = new URL(request.url);
  const state = crypto.randomUUID();

  // state を KV に保存（CSRF 対策、10分 TTL）
  await env.STRAVA_KV.put(`oauth_state:${state}`, '1', { expirationTtl: STATE_TTL });

  const redirectUri = `${url.origin}/api/strava/callback`;
  const authUrl = new URL(STRAVA_AUTH_URL);
  authUrl.searchParams.set('client_id', env.CLIENT_ID);
  authUrl.searchParams.set('redirect_uri', redirectUri);
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('scope', STRAVA_SCOPE);
  authUrl.searchParams.set('approval_prompt', 'auto');
  authUrl.searchParams.set('state', state);

  console.info('[auth] redirect_uri:', redirectUri, 'client_id:', env.CLIENT_ID);
  return Response.redirect(authUrl.toString(), 302);
}

// GET /api/strava/callback → トークン交換 + セッション作成
export async function handleCallback(request: Request, env: Env): Promise<Response> {
  if (request.method !== 'GET') return errorResponse('Method not allowed', 405);

  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const error = url.searchParams.get('error');

  console.info('[callback] params:', { code: !!code, state: !!state, error, search: url.search });

  // ユーザーが認可を拒否した場合
  if (error) {
    return Response.redirect(`${url.origin}/strava?error=denied`, 302);
  }

  if (!code || !state) {
    console.error('[callback] Missing code or state:', url.search);
    return errorResponse('Missing code or state', 400);
  }

  // state 検証（CSRF 対策）
  const storedState = await env.STRAVA_KV.get(`oauth_state:${state}`);
  if (!storedState) {
    console.error('[callback] Invalid or expired state:', state);
    return errorResponse('Invalid or expired state', 403);
  }
  // 使い捨て: 検証後に削除
  await env.STRAVA_KV.delete(`oauth_state:${state}`);

  // トークン交換
  let tokenData;
  try {
    tokenData = await exchangeCode(env, code);
  } catch {
    return Response.redirect(`${url.origin}/strava?error=token_exchange`, 302);
  }

  // セッション作成
  const sessionId = crypto.randomUUID();
  await saveSession(env, sessionId, {
    accessToken: tokenData.access_token,
    refreshToken: tokenData.refresh_token,
    expiresAt: tokenData.expires_at,
    athleteId: tokenData.athlete.id,
  });

  // オーナーの最新セッションを記録（訪問者向け公開表示用）
  await env.STRAVA_KV.put('owner:latest', sessionId, { expirationTtl: SESSION_TTL });

  // Cookie セット + /strava にリダイレクト
  return new Response(null, {
    status: 302,
    headers: {
      Location: `${url.origin}/strava`,
      'Set-Cookie': createSessionCookie(sessionId),
    },
  });
}
