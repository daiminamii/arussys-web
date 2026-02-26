// POST /api/strava/disconnect — Strava deauthorize + KV 削除
// TODO: 管理者専用エンドポイント。現在は認証済みセッションがあれば誰でも実行可能。
//       一般公開時は管理者判定（athleteId チェック等）を追加する。
import type { Env } from '../env';
import { STRAVA_DEAUTHORIZE_URL } from './constants';
import { getSession, getSessionId, clearSessionCookie } from './session';
import { json, errorResponse } from '../utils/response';

export async function handleDisconnect(request: Request, env: Env): Promise<Response> {
  if (request.method !== 'POST') return errorResponse('Method not allowed', 405);

  const sessionId = getSessionId(request);
  if (!sessionId) return errorResponse('Unauthorized', 401);

  const session = await getSession(request, env);
  if (!session) return errorResponse('Session expired', 401);

  // Strava deauthorize（ベストエフォート）
  try {
    await fetch(STRAVA_DEAUTHORIZE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `access_token=${session.accessToken}`,
    });
  } catch {
    // Strava 側の失敗はログのみ、ローカルセッションは削除続行
  }

  // KV からセッション削除
  await env.STRAVA_KV.delete(`session:${sessionId}`);

  // キャッシュ削除（list + delete、件数少ないので問題なし）
  const cachePrefix = `cache:activities:${session.athleteId}:`;
  const keys = await env.STRAVA_KV.list({ prefix: cachePrefix });
  await Promise.all(keys.keys.map((k) => env.STRAVA_KV.delete(k.name)));

  // Cookie クリア + 成功レスポンス
  const res = json({ success: true });
  res.headers.set('Set-Cookie', clearSessionCookie());
  return res;
}
