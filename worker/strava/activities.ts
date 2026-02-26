// GET /api/strava/activities — アクティビティ一覧（KV キャッシュ付き）
import type { Env } from '../env';
import { STRAVA_API_BASE, CACHE_TTL } from './constants';
import { getSession, getSessionId } from './session';
import { ensureFreshToken } from './token';
import { errorResponse } from '../utils/response';

export async function handleActivities(request: Request, env: Env): Promise<Response> {
  if (request.method !== 'GET') return errorResponse('Method not allowed', 405);

  const sessionId = getSessionId(request);
  if (!sessionId) return errorResponse('Unauthorized', 401);

  const session = await getSession(request, env);
  if (!session) return errorResponse('Session expired', 401);

  const url = new URL(request.url);
  const afterRaw = url.searchParams.get('after');
  const beforeRaw = url.searchParams.get('before');
  const perPage = url.searchParams.get('per_page') || '200';

  // after/before バリデーション
  let after: number | undefined;
  let before: number | undefined;
  if (afterRaw !== null) {
    if (afterRaw === '') return errorResponse('Invalid after parameter', 400);
    after = Number(afterRaw);
    if (!Number.isInteger(after) || after < 0) return errorResponse('Invalid after parameter', 400);
  }
  if (beforeRaw !== null) {
    if (beforeRaw === '') return errorResponse('Invalid before parameter', 400);
    before = Number(beforeRaw);
    if (!Number.isInteger(before) || before < 0) return errorResponse('Invalid before parameter', 400);
  }
  if (after !== undefined && before !== undefined && before <= after) {
    return errorResponse('before must be greater than after', 400);
  }

  // KV キャッシュチェック
  const cacheKey = `cache:activities:${session.athleteId}:${after ?? ''}:${before ?? ''}:${perPage}`;
  const cached = await env.STRAVA_KV.get(cacheKey);
  if (cached) {
    return new Response(cached, {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // トークンリフレッシュ（必要時）
  let accessToken: string;
  try {
    accessToken = await ensureFreshToken(env, sessionId, session);
  } catch {
    return errorResponse('Token refresh failed', 401);
  }

  // Strava API 代理リクエスト
  const apiUrl = new URL(`${STRAVA_API_BASE}/athlete/activities`);
  if (after !== undefined) apiUrl.searchParams.set('after', String(after));
  if (before !== undefined) apiUrl.searchParams.set('before', String(before));
  apiUrl.searchParams.set('per_page', perPage);

  const res = await fetch(apiUrl.toString(), {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) {
    return errorResponse(`Strava API error: ${res.status}`, res.status);
  }

  const body = await res.text();

  // KV キャッシュ保存（15分 TTL）
  await env.STRAVA_KV.put(cacheKey, body, { expirationTtl: CACHE_TTL });

  return new Response(body, {
    headers: { 'Content-Type': 'application/json' },
  });
}
