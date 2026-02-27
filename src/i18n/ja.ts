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
    subtitle: 'Strava のトレーニングアクティビティ。',
    authDenied: '認可が拒否されました。',
    authError: '認証に失敗しました。もう一度お試しください。',
    monthLabel: '月',
    loading: 'アクティビティを読み込み中...',
    distance: '距離',
    time: '時間',
    elevation: '獲得標高',
    noActivities: 'アクティビティが見つかりません。',
    activities: 'アクティビティ',
    totalDistance: '合計距離',
    totalTime: '合計時間',
    unknownDevice: '不明なデバイス',
    limitWarning: '最大200件まで表示しています。一部表示されていない可能性があります。',
    disconnect: 'Strava 連携を解除',
    disconnectConfirm: 'Strava アカウントとの連携を解除しますか？',
  },
  contact: {
    heading: 'お問い合わせ',
    subtitle: 'お気軽にお問い合わせください。',
    namePlaceholder: 'お名前',
    emailPlaceholder: 'メールアドレス',
    messagePlaceholder: 'メッセージ',
    submit: '送信',
    sending: '送信中...',
    success: 'メッセージを送信しました！',
    errorRequired: 'すべての項目を入力してください。',
    errorEmail: '有効なメールアドレスを入力してください。',
    errorRateLimit: '少し時間をおいてから再送信してください。',
    errorGeneric: '送信に失敗しました。後ほどお試しください。',
  },
  project: {
    website: 'Website',
    github: 'GitHub',
  },
  footer: {
    copyright: '© {year} Arus Systems',
  },
};
