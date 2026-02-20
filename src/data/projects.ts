// ポートフォリオ プロジェクト定義（中身は今後個別実装）
import type { Project } from '@/types/portfolio';

export const projects: Project[] = [
  {
    id: 'arussys-web',
    title: 'Three.js Particle Portfolio',
    description:
      'This site. Interactive 3D particle system with mouse-driven attraction physics, built with React, Three.js, and Tailwind CSS. Deployed on Cloudflare Workers.',
    tags: ['React', 'Three.js', 'TypeScript', 'Cloudflare Workers'],
    url: 'https://arussys.com',
    github: 'https://github.com/acesdmg/arussys-web',
    year: 2026,
  },
  {
    id: 'babylon-scene-editor',
    title: 'Babylon.js Scene Editor',
    description:
      'Interactive 3D scene editor built with Babylon.js. Real-time material editing, lighting setup, and camera controls with React UI integration.',
    tags: ['Babylon.js', 'React', 'TypeScript', 'WebGL'],
    year: 2026,
  },
  {
    id: 'opencascade-web-viewer',
    title: 'OpenCASCADE CAD Web Viewer',
    description:
      'Browser-based 3D CAD viewer using OpenCASCADE compiled to WebAssembly via Emscripten. Supports STEP/IGES import with section planes and measurement tools.',
    tags: ['C++', 'OpenCASCADE', 'WebAssembly', 'Three.js'],
    year: 2025,
  },
  {
    id: 'blender-addon',
    title: 'Blender Python Addon — Batch Processor',
    description:
      'Blender addon for automated mesh processing and batch export. Custom operator panels, scene graph manipulation, and configurable export pipelines.',
    tags: ['Blender', 'Python', 'Addon Development'],
    year: 2025,
  },
  {
    id: 'gps-3d-visualizer',
    title: 'Three.js GPS Track 3D Visualizer',
    description:
      'GPU-accelerated 3D visualization of GPS activity tracks. Elevation profiles and route rendering on terrain mesh with real-time camera controls.',
    tags: ['Three.js', 'WebGL', 'Strava API', 'TypeScript'],
    year: 2026,
  },
  {
    id: 'training-dashboard',
    title: 'Strava/Coros Training Analytics Dashboard',
    description:
      'Sports performance dashboard aggregating data from Strava and Coros. Weekly volume, TSS trends, and pace/power analysis with interactive charts.',
    tags: ['React', 'D3.js', 'Strava API', 'Coros API'],
    year: 2025,
  },
];
