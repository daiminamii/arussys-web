// i18n コンテキスト（言語状態 + 翻訳テキスト提供）
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { Language, Translations } from './types';
import { en } from './en';
import { ja } from './ja';

const STORAGE_KEY = 'lang';

const translations: Record<Language, Translations> = { en, ja };

interface LanguageContextValue {
  language: Language;
  t: Translations;
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

// localStorage から保存済み言語を取得（フォールバック: en）
function readStoredLanguage(): Language {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'en' || stored === 'ja') return stored;
  } catch {
    // localStorage unavailable
  }
  return 'en';
}

// 言語状態管理プロバイダー（localStorage 永続化 + html lang 属性同期）
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(readStoredLanguage);

  useEffect(() => {
    document.documentElement.lang = language;
    try {
      localStorage.setItem(STORAGE_KEY, language);
    } catch {
      // localStorage unavailable
    }
  }, [language]);

  const toggleLanguage = useCallback(
    () => setLanguage((prev) => (prev === 'en' ? 'ja' : 'en')),
    [],
  );

  const value = useMemo(
    () => ({ language, t: translations[language], toggleLanguage }),
    [language, toggleLanguage],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

// 言語コンテキスト取得フック（Provider 外で呼ぶとエラー）
export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return ctx;
}
