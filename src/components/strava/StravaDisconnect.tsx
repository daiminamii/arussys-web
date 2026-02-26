// Strava 切断ボタン
// TODO: 管理者（自分）専用の機能。一般公開時は非表示にするか、管理者判定ロジックを追加する。
import { useState } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';

interface Props {
  onDisconnect: () => Promise<void>;
}

function StravaDisconnect({ onDisconnect }: Props) {
  const { t } = useLanguage();
  const [confirming, setConfirming] = useState(false);

  if (!confirming) {
    return (
      <button
        onClick={() => setConfirming(true)}
        className="text-sm text-gray-400 underline hover:text-gray-300"
      >
        {t.strava.disconnect}
      </button>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-gray-400">{t.strava.disconnectConfirm}</span>
      <button
        onClick={async () => {
          await onDisconnect();
          setConfirming(false);
        }}
        className="rounded bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700"
      >
        {t.strava.disconnect}
      </button>
      <button
        onClick={() => setConfirming(false)}
        className="text-sm text-gray-400 hover:text-gray-300"
      >
        Cancel
      </button>
    </div>
  );
}

export default StravaDisconnect;
