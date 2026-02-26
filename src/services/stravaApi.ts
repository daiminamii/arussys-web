// /api/strava/* fetch ラッパー
import type { StravaActivity, StravaAuthStatus } from '@/types/strava';

export async function fetchAuthStatus(): Promise<StravaAuthStatus> {
  const res = await fetch('/api/strava/status');
  if (!res.ok) return { authenticated: false };
  return res.json();
}

/** YYYY-MM-DD → JST ベース Unix timestamp (after, before) */
export function dateToTimestamps(dateStr: string): { after: number; before: number } {
  const after = Date.parse(dateStr + 'T00:00:00+09:00') / 1000;
  const before = Date.parse(dateStr + 'T23:59:59+09:00') / 1000;
  return { after, before };
}

export async function fetchActivities(after?: number, before?: number): Promise<StravaActivity[]> {
  const params = new URLSearchParams();
  if (after !== undefined) params.set('after', String(after));
  if (before !== undefined) params.set('before', String(before));
  const qs = params.toString();
  const res = await fetch(`/api/strava/activities${qs ? '?' + qs : ''}`);
  if (!res.ok) throw new Error(`Failed to fetch activities: ${res.status}`);
  return res.json();
}

export async function disconnect(): Promise<void> {
  const res = await fetch('/api/strava/disconnect', { method: 'POST' });
  if (!res.ok) throw new Error(`Failed to disconnect: ${res.status}`);
}
