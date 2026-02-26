// アクティビティ一覧（月ベース + デバイスグルーピング）
import { useState, useEffect } from 'react';
import type { StravaActivity } from '@/types/strava';
import { fetchActivities, monthToTimestamps } from '@/services/stravaApi';
import { useLanguage } from '@/i18n/LanguageContext';
import { groupByDevice, borderColorByIndex } from '@/utils/deviceMapping';
import DeviceSummary from './DeviceSummary';
import ActivityCard from './ActivityCard';

interface Props {
  month: string;
}

function ActivityList({ month }: Props) {
  const { t } = useLanguage();
  const [activities, setActivities] = useState<StravaActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    const { after, before } = monthToTimestamps(month);
    fetchActivities(after, before)
      .then((data) => {
        if (!cancelled) setActivities(data);
      })
      .catch(() => {
        if (!cancelled) setError('Failed to load activities');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [month]);

  if (loading) {
    return <p className="text-gray-400">{t.strava.loading}</p>;
  }

  if (error) {
    return <p className="text-red-400">{error}</p>;
  }

  if (activities.length === 0) {
    return <p className="text-gray-400">{t.strava.noActivities}</p>;
  }

  const groups = groupByDevice(activities, t.strava.unknownDevice);

  return (
    <div className="space-y-8">
      {activities.length === 200 && (
        <p className="text-sm text-yellow-400">{t.strava.limitWarning}</p>
      )}

      <DeviceSummary groups={groups} />

      {groups.map((group, i) => (
        <div key={group.deviceName}>
          <h2 className={`mb-4 border-b ${borderColorByIndex(i)} pb-2 text-lg font-semibold text-white`}>
            {group.deviceName} ({group.count})
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {group.activities.map((a) => (
              <ActivityCard key={a.id} activity={a} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default ActivityList;
