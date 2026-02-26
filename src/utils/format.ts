// 表示用フォーマットユーティリティ

export function formatDistance(meters: number): string {
  return (meters / 1000).toFixed(1) + ' km';
}

export function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}
