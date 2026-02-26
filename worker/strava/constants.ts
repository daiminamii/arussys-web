// Strava API 定数
export const STRAVA_AUTH_URL = 'https://www.strava.com/oauth/authorize';
export const STRAVA_TOKEN_URL = 'https://www.strava.com/oauth/token';
export const STRAVA_DEAUTHORIZE_URL = 'https://www.strava.com/oauth/deauthorize';
export const STRAVA_API_BASE = 'https://www.strava.com/api/v3';
export const STRAVA_SCOPE = 'activity:read_all';

// セッション: 365日（トークンリフレッシュ時に TTL リセット）
export const SESSION_TTL = 60 * 60 * 24 * 365; // 31536000秒
// OAuth state: 10分
export const STATE_TTL = 60 * 10; // 600秒
// キャッシュ: 15分
export const CACHE_TTL = 60 * 15; // 900秒
// トークンリフレッシュバッファ: 60秒前
export const REFRESH_BUFFER = 60;
