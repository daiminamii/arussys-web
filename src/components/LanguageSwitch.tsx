// 言語切替ボタン（EN | JP トグル）
import { useLanguage } from '@/i18n/LanguageContext';

function LanguageSwitch() {
  const { language, t, toggleLanguage } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      aria-label={t.aria.switchLanguage}
      className="flex items-center gap-1.5 text-sm"
    >
      <span
        lang="en"
        className={language === 'en' ? 'text-white' : 'text-gray-500 hover:text-gray-300'}
      >
        EN
      </span>
      <span className="text-gray-600" aria-hidden="true">|</span>
      <span
        lang="ja"
        className={language === 'ja' ? 'text-white' : 'text-gray-500 hover:text-gray-300'}
      >
        JP
      </span>
    </button>
  );
}

export default LanguageSwitch;
