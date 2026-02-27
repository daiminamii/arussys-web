// Strava データ可視化ページ
import { useState, useEffect } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
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
  const [month, setMonth] = useState(currentMonthJST);
  const [authError, setAuthError] = useState<string | null>(null);

  // OAuth コールバックからのエラーパラメータを処理
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlError = params.get('error');
    if (urlError) {
      setAuthError(urlError === 'denied' ? 'denied' : 'error');
      const clean = new URL(window.location.href);
      clean.searchParams.delete('error');
      window.history.replaceState({}, '', clean.pathname);
    }
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{t.strava.heading}</h1>
        <p className="text-gray-400 mb-4">{t.strava.subtitle}</p>
        <PoweredByStrava />
      </div>

      {authError === 'denied' && (
        <div className="mb-6 rounded-lg border border-yellow-800 bg-yellow-900/20 p-3 text-sm text-yellow-300">
          {t.strava.authDenied}
        </div>
      )}
      {authError === 'error' && (
        <div className="mb-6 rounded-lg border border-red-800 bg-red-900/20 p-3 text-sm text-red-300">
          {t.strava.authError}
        </div>
      )}

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
    </div>
  );
}

export default StravaPage;
