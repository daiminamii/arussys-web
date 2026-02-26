// アクティビティ一覧（日付ベース取得）
import { useState, useEffect } from 'react';
import type { StravaActivity } from '@/types/strava';
import { fetchActivities, dateToTimestamps } from '@/services/stravaApi';
import { useLanguage } from '@/i18n/LanguageContext';
import ActivityCard from './ActivityCard';

interface Props {
  date: string;
}

function ActivityList({ date }: Props) {
  const { t } = useLanguage();
  const [activities, setActivities] = useState<StravaActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    const { after, before } = dateToTimestamps(date);
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
  }, [date]);

  if (loading) {
    return <p className="text-gray-400">{t.strava.loading}</p>;
  }

  if (error) {
    return <p className="text-red-400">{error}</p>;
  }

  if (activities.length === 0) {
    return <p className="text-gray-400">{t.strava.noActivities}</p>;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {activities.map((a) => (
        <ActivityCard key={a.id} activity={a} />
      ))}
    </div>
  );
}

export default ActivityList;
