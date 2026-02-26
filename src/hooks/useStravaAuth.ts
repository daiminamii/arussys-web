// Strava 認証状態管理フック（自動リダイレクト付き）
// TODO: 現在は未認証で /strava にアクセスすると自動で Strava OAuth にリダイレクトされる。
//       任意の訪問者が強制的に連携させられる問題がある。
//       → ランディング画面に「Connect with Strava」ボタンを表示し、ユーザー操作でリダイレクトする方式に変更する。
import { useState, useEffect, useCallback } from 'react';
import type { StravaAuthStatus } from '@/types/strava';
import { fetchAuthStatus, disconnect as apiDisconnect } from '@/services/stravaApi';

const REDIRECT_KEY = 'strava_redirect_attempted';

// sessionStorage ヘルパー（Safari プライベートモード対策）
function getStorage(key: string): string | null {
  try { return sessionStorage.getItem(key); } catch { return null; }
}
function setStorage(key: string, value: string): void {
  try { sessionStorage.setItem(key, value); } catch { /* ignore */ }
}
function removeStorage(key: string): void {
  try { sessionStorage.removeItem(key); } catch { /* ignore */ }
}

interface UseStravaAuth {
  status: StravaAuthStatus | null;
  loading: boolean;
  error: string | null;
  authError: string | null;
  disconnect: () => Promise<void>;
  refresh: () => Promise<void>;
}

export function useStravaAuth(): UseStravaAuth {
  const [status, setStatus] = useState<StravaAuthStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAuthStatus();
      setStatus(data);
      if (data.authenticated) {
        removeStorage(REDIRECT_KEY);
      }
    } catch {
      setError('Failed to check auth status');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // URL ?error= パラメータチェック（ガード1）
    const params = new URLSearchParams(window.location.search);
    const urlError = params.get('error');
    if (urlError) {
      setAuthError(urlError === 'denied' ? 'denied' : 'error');
      // URL からエラーパラメータを除去
      const clean = new URL(window.location.href);
      clean.searchParams.delete('error');
      window.history.replaceState({}, '', clean.pathname);
    }

    refresh();
  }, [refresh]);

  // 自動リダイレクト（ガード2: sessionStorage）
  // TODO: 自動リダイレクトを廃止し、ボタン操作に変更する（上部コメント参照）
  useEffect(() => {
    if (loading || !status || status.authenticated || authError || error) return;

    if (getStorage(REDIRECT_KEY)) return;

    setStorage(REDIRECT_KEY, '1');
    window.location.href = '/api/strava/auth';
  }, [loading, status, authError, error]);

  const disconnect = useCallback(async () => {
    try {
      await apiDisconnect();
      setStatus({ authenticated: false });
    } catch {
      setError('Failed to disconnect');
    }
  }, []);

  return { status, loading, error, authError, disconnect, refresh };
}
