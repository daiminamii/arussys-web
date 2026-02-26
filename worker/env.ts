// Cloudflare Worker バインディング型定義
export interface Env {
  ASSETS: Fetcher;
  STRAVA_KV: KVNamespace;
  CLIENT_ID: string;
  CLIENT_SECRET: string;
}
