// Stravaデータ可視化ページ（未実装）
import { useLanguage } from '@/i18n/LanguageContext';

function StravaPage() {
  const { t } = useLanguage();

  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-4">{t.strava.heading}</h1>
      <p className="text-gray-400">{t.strava.comingSoon}</p>
    </div>
  );
}

export default StravaPage;
