// デバイス別アクティビティグルーピング（API の device_name で動的分類）
import type { StravaActivity } from '@/types/strava';

export interface DeviceGroup {
  deviceName: string; // 表示名（device_name そのまま or "Unknown"）
  activities: StravaActivity[];
  count: number;
  totalDistance: number; // メートル
  totalMovingTime: number; // 秒
}

/** アクティビティ配列 → device_name 別グループ（件数降順） */
export function groupByDevice(activities: StravaActivity[], unknownLabel = 'Unknown'): DeviceGroup[] {
  const map = new Map<string, StravaActivity[]>();

  for (const a of activities) {
    const key = a.device_name || unknownLabel;
    const list = map.get(key);
    if (list) {
      list.push(a);
    } else {
      map.set(key, [a]);
    }
  }

  return Array.from(map.entries())
    .map(([deviceName, list]) => ({
      deviceName,
      activities: list,
      count: list.length,
      totalDistance: list.reduce((sum, a) => sum + a.distance, 0),
      totalMovingTime: list.reduce((sum, a) => sum + a.moving_time, 0),
    }))
    .sort((a, b) => b.count - a.count);
}

/** グループ index → border 色（Tailwind クラス） */
// Tailwind の動的クラス生成に対応するため、完全なクラス名を列挙
const BORDER_PALETTE = [
  'border-orange-500',
  'border-blue-500',
  'border-cyan-500',
  'border-emerald-500',
  'border-violet-500',
  'border-rose-500',
  'border-amber-500',
  'border-teal-500',
] as const;

export function borderColorByIndex(index: number): string {
  return BORDER_PALETTE[index % BORDER_PALETTE.length];
}
