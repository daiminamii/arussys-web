// 日本語翻訳
import type { Translations } from './types';

export const ja: Translations = {
  nav: {
    home: 'Home',
    portfolio: 'Portfolio',
    strava: 'Strava',
  },
  aria: {
    openMenu: 'メニューを開く',
    closeMenu: 'メニューを閉じる',
    siteMenu: 'サイトメニュー',
    switchLanguage: 'Switch to English',
  },
  home: {
    subtitle: 'スポーツ × テック 開発者ポートフォリオ',
    aboutHeading: 'About',
    aboutParagraph1:
      'C++ ジオメトリカーネルや Blender アドオン開発からインタラクティブ WebGL アプリケーションまで、3D パイプライン全体をカバーするソフトウェア開発者。Three.js、Babylon.js、OpenCASCADE、React、TypeScript を活用して開発しています。',
    aboutParagraph2:
      'このポートフォリオでは、リアルタイム 3D ビジュアライゼーション、CAD ジオメトリ処理、Blender ツール、スポーツデータ分析などのプロジェクトを紹介しています。ネイティブのパフォーマンスとモダンな Web 体験をつなぐ開発を行っています。',
    skillHeading: {
      frontend: 'Frontend',
      webgl: '3D / WebGL',
      native: 'Native / CAD',
      infrastructure: 'Infrastructure',
    },
  },
  portfolio: {
    heading: 'Portfolio',
    subtitle:
      'スポーツテック、3D ビジュアライゼーション、Web 開発のプロジェクト集。',
  },
  strava: {
    heading: 'Strava',
    comingSoon: 'Strava 連携は近日公開予定です。',
  },
  project: {
    website: 'Website',
    github: 'GitHub',
  },
  footer: {
    copyright: '© {year} Arus Systems',
  },
};
