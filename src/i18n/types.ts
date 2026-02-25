// i18n 型定義（対応言語 + 翻訳キー構造）
export type Language = 'en' | 'ja';

export interface Translations {
  nav: { home: string; portfolio: string; strava: string };
  aria: {
    openMenu: string;
    closeMenu: string;
    siteMenu: string;
    switchLanguage: string;
  };
  home: {
    subtitle: string;
    aboutHeading: string;
    aboutParagraph1: string;
    aboutParagraph2: string;
    skillHeading: {
      frontend: string;
      webgl: string;
      native: string;
      infrastructure: string;
    };
  };
  portfolio: { heading: string; subtitle: string };
  strava: { heading: string; comingSoon: string };
  project: { website: string; github: string };
  footer: { copyright: string };
}
