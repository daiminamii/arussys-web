// Worker エントリポイント: API ルーティング + Assets フォールバック
import type { Env } from './env';
import { handleAuth, handleCallback } from './strava/auth';
import { handleActivities } from './strava/activities';
import { handleDisconnect } from './strava/disconnect';
import { handleStatus } from './strava/session';
import { handleContact } from './contact';
import { errorResponse } from './utils/response';

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // API ルーティング
    if (url.pathname.startsWith('/api/')) {
      return handleApi(request, env, url);
    }

    // 非 API リクエスト → 静的アセット（SPA フォールバック: GET のみ）
    if (request.method === 'GET') {
      const asset = await env.ASSETS.fetch(request);
      if (asset.status !== 404) return asset;
      // SPA: 静的ファイルに該当しないパスは index.html を返す
      return env.ASSETS.fetch(new URL('/index.html', request.url));
    }
    return errorResponse('Not found', 404);
  },
} satisfies ExportedHandler<Env>;

async function handleApi(request: Request, env: Env, url: URL): Promise<Response> {
  switch (url.pathname) {
    case '/api/strava/auth':
      return handleAuth(request, env);
    case '/api/strava/callback':
      return handleCallback(request, env);
    case '/api/strava/activities':
      return handleActivities(request, env);
    case '/api/strava/disconnect':
      return handleDisconnect(request, env);
    case '/api/strava/status':
      return handleStatus(request, env);
    case '/api/contact':
      return handleContact(request, env);
    default:
      return errorResponse('Not found', 404);
  }
}
