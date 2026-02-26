// 個別アクティビティカード
import type { StravaActivity } from '@/types/strava';
import { useLanguage } from '@/i18n/LanguageContext';

interface Props {
  activity: StravaActivity;
}

function formatDistance(meters: number): string {
  return (meters / 1000).toFixed(1) + ' km';
}

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function ActivityCard({ activity }: Props) {
  const { t } = useLanguage();

  return (
    <div className="rounded-lg border border-gray-700 bg-gray-800/50 p-4">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="font-semibold text-white">{activity.name}</h3>
        <span className="text-xs text-gray-400">{activity.sport_type}</span>
      </div>
      <p className="mb-3 text-xs text-gray-500">{formatDate(activity.start_date)}</p>
      <div className="grid grid-cols-3 gap-2 text-center">
        <div>
          <p className="text-xs text-gray-400">{t.strava.distance}</p>
          <p className="font-mono text-sm text-white">{formatDistance(activity.distance)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400">{t.strava.time}</p>
          <p className="font-mono text-sm text-white">{formatTime(activity.moving_time)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400">{t.strava.elevation}</p>
          <p className="font-mono text-sm text-white">{activity.total_elevation_gain.toFixed(0)} m</p>
        </div>
      </div>
    </div>
  );
}

export default ActivityCard;
