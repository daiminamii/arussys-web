// Strava 認証状態管理フック
import { useState, useEffect, useCallback } from 'react';
import type { StravaAuthStatus } from '@/types/strava';
import { fetchAuthStatus, disconnect as apiDisconnect } from '@/services/stravaApi';

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
    } catch {
      setError('Failed to check auth status');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // URL ?error= パラメータチェック（OAuth コールバックからのエラー）
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
