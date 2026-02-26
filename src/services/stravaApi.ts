// /api/strava/* fetch ラッパー
import type { StravaActivity, StravaAuthStatus } from '@/types/strava';

export async function fetchAuthStatus(): Promise<StravaAuthStatus> {
  const res = await fetch('/api/strava/status');
  if (!res.ok) return { authenticated: false };
  return res.json();
}

/** YYYY-MM → JST ベース Unix timestamp (月初 00:00 〜 翌月初 00:00) */
export function monthToTimestamps(monthStr: string): { after: number; before: number } {
  const [year, month] = monthStr.split('-').map(Number);
  const after = Date.parse(`${year}-${String(month).padStart(2, '0')}-01T00:00:00+09:00`) / 1000;
  // 翌月1日 00:00:00 JST
  const nextMonth = month === 12 ? 1 : month + 1;
  const nextYear = month === 12 ? year + 1 : year;
  const before = Date.parse(`${nextYear}-${String(nextMonth).padStart(2, '0')}-01T00:00:00+09:00`) / 1000;
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
