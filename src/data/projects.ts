// ポートフォリオ プロジェクト定義（中身は今後個別実装）
import type { Project } from '@/types/portfolio';

export const projects: Project[] = [
  {
    id: 'arussys-web',
    title: {
      en: 'Three.js Particle Portfolio',
      ja: 'Three.js パーティクル ポートフォリオ',
    },
    description: {
      en: 'This site. Interactive 3D particle system with mouse-driven attraction physics, built with React, Three.js, and Tailwind CSS. Deployed on Cloudflare Workers.',
      ja: 'このサイト。マウス追従の引力物理を持つインタラクティブ 3D パーティクルシステム。React、Three.js、Tailwind CSS で構築し、Cloudflare Workers にデプロイ。',
    },
    tags: ['React', 'Three.js', 'TypeScript', 'Cloudflare Workers'],
    url: 'https://arussys.com',
    github: 'https://github.com/acesdmg/arussys-web',
    year: 2026,
  },
  {
    id: 'babylon-scene-editor',
    title: {
      en: 'Babylon.js Scene Editor',
      ja: 'Babylon.js シーンエディタ',
    },
    description: {
      en: 'Interactive 3D scene editor built with Babylon.js. Real-time material editing, lighting setup, and camera controls with React UI integration.',
      ja: 'Babylon.js で構築したインタラクティブ 3D シーンエディタ。リアルタイムのマテリアル編集、ライティング設定、カメラ操作を React UI と統合。',
    },
    tags: ['Babylon.js', 'React', 'TypeScript', 'WebGL'],
    year: 2026,
  },
  {
    id: 'opencascade-web-viewer',
    title: {
      en: 'OpenCASCADE CAD Web Viewer',
      ja: 'OpenCASCADE CAD Web ビューア',
    },
    description: {
      en: 'Browser-based 3D CAD viewer using OpenCASCADE compiled to WebAssembly via Emscripten. Supports STEP/IGES import with section planes and measurement tools.',
      ja: 'Emscripten で WebAssembly にコンパイルした OpenCASCADE を使用したブラウザベースの 3D CAD ビューア。STEP/IGES インポート、断面表示、計測ツールに対応。',
    },
    tags: ['C++', 'OpenCASCADE', 'WebAssembly', 'Three.js'],
    year: 2025,
  },
  {
    id: 'blender-addon',
    title: {
      en: 'Blender Python Addon — Batch Processor',
      ja: 'Blender Python アドオン — バッチプロセッサ',
    },
    description: {
      en: 'Blender addon for automated mesh processing and batch export. Custom operator panels, scene graph manipulation, and configurable export pipelines.',
      ja: 'メッシュの自動処理とバッチエクスポート用 Blender アドオン。カスタムオペレータパネル、シーングラフ操作、設定可能なエクスポートパイプライン。',
    },
    tags: ['Blender', 'Python', 'Addon Development'],
    year: 2025,
  },
  {
    id: 'gps-3d-visualizer',
    title: {
      en: 'Three.js GPS Track 3D Visualizer',
      ja: 'Three.js GPS トラック 3D ビジュアライザ',
    },
    description: {
      en: 'GPU-accelerated 3D visualization of GPS activity tracks. Elevation profiles and route rendering on terrain mesh with real-time camera controls.',
      ja: 'GPS アクティビティトラックの GPU アクセラレーション 3D ビジュアライゼーション。地形メッシュ上の標高プロファイルとルート描画、リアルタイムカメラ操作。',
    },
    tags: ['Three.js', 'WebGL', 'Strava API', 'TypeScript'],
    year: 2026,
  },
  {
    id: 'training-dashboard',
    title: {
      en: 'Strava/Coros Training Analytics Dashboard',
      ja: 'Strava/Coros トレーニング分析ダッシュボード',
    },
    description: {
      en: 'Sports performance dashboard aggregating data from Strava and Coros. Weekly volume, TSS trends, and pace/power analysis with interactive charts.',
      ja: 'Strava と Coros のデータを統合したスポーツパフォーマンスダッシュボード。週間ボリューム、TSS トレンド、ペース/パワー分析をインタラクティブチャートで表示。',
    },
    tags: ['React', 'D3.js', 'Strava API', 'Coros API'],
    year: 2025,
  },
];
