// Strava データ可視化ページ
import { useState } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { useStravaAuth } from '@/hooks/useStravaAuth';
import PoweredByStrava from '@/components/strava/PoweredByStrava';
import ActivityList from '@/components/strava/ActivityList';

/** 現在の JST 月を YYYY-MM で返す */
function currentMonthJST(): string {
  const now = new Date();
  const jst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  return jst.toISOString().slice(0, 7);
}

function StravaPage() {
  const { t } = useLanguage();
  const { status, loading, error, authError } = useStravaAuth();
  const [month, setMonth] = useState(currentMonthJST);

  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{t.strava.heading}</h1>
        <p className="text-gray-400 mb-4">{t.strava.subtitle}</p>
        <PoweredByStrava />
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-red-800 bg-red-900/20 p-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {loading && !status && (
        <p className="text-gray-400">{t.strava.loading}</p>
      )}

      {status && !status.authenticated && (
        <div className="space-y-4">
          {authError === 'denied' && (
            <p className="text-yellow-400">{t.strava.authDenied}</p>
          )}
          {authError === 'error' && (
            <p className="text-red-400">{t.strava.authError}</p>
          )}
          <a
            href="/api/strava/auth"
            className="inline-flex items-center gap-2 rounded-lg bg-[#FC4C02] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#e04400]"
          >
            {t.strava.connect}
          </a>
        </div>
      )}

      {status?.authenticated && (
        <div className="space-y-8">
          <div className="flex items-center gap-3">
            <label htmlFor="strava-month" className="text-sm text-gray-300">
              {t.strava.monthLabel}
            </label>
            <input
              id="strava-month"
              type="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="rounded-lg border border-gray-600 bg-gray-800 px-3 py-1.5 text-sm text-white"
            />
          </div>
          <ActivityList month={month} />
        </div>
      )}
    </div>
  );
}

export default StravaPage;
