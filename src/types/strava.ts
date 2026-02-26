// Strava アクティビティ型（ブラウザ側、使用フィールドのみ）
export interface StravaActivity {
  id: number;
  name: string;
  type: string;
  sport_type: string;
  start_date: string;
  distance: number; // メートル
  moving_time: number; // 秒
  elapsed_time: number; // 秒
  total_elevation_gain: number; // メートル
  average_speed: number; // m/s
  max_speed: number; // m/s
  device_name: string | null; // デバイス名（Strava API 提供）
  trainer: boolean; // インドアトレーナーフラグ
}

export interface StravaAuthStatus {
  authenticated: boolean;
  athleteId?: number;
}
