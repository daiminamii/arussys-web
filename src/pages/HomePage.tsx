// トップページ（ヒーロー3D + プロフィール + スキルカード）
import { lazy, Suspense } from 'react';

// Three.js含むため遅延読み込み
const HeroScene = lazy(() => import('@/components/three/HeroScene'));

// WebGL非対応時のフォールバック
function HeroFallback() {
  return <div className="absolute inset-0 bg-gray-950" />;
}

// WebGL対応チェック（初回のみ実行）
function canWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      canvas.getContext('webgl2') || canvas.getContext('webgl')
    );
  } catch {
    return false;
  }
}

const webglSupported = canWebGL();

function HomePage() {
  return (
    <div>
      {/* ヒーロー */}
      <section className="relative flex h-[60vh] sm:h-[80vh] items-center justify-center overflow-hidden">
        {webglSupported ? (
          <Suspense fallback={<HeroFallback />}>
            <HeroScene />
          </Suspense>
        ) : (
          <HeroFallback />
        )}

        {/* テキスト */}
        <div className="relative z-10 text-center">
          <div className="rounded-xl bg-gray-950/60 px-4 py-4 sm:px-8 sm:py-6 backdrop-blur-sm">
            <h1 className="mb-3 text-5xl font-bold tracking-tight sm:text-6xl">
              Arus Systems
            </h1>
            <p className="text-lg text-gray-400 sm:text-xl">
              Sports &times; Tech Developer Portfolio
            </p>
          </div>
        </div>
      </section>

      {/* プロフィール */}
      <section className="mx-auto max-w-3xl px-4 py-12 sm:py-20">
        <h2 className="mb-6 text-2xl font-bold">About</h2>
        <div className="space-y-4 text-gray-400 leading-relaxed">
          <p>
            Software developer working across the full 3D pipeline — from C++
            geometry kernels and Blender addon scripting to interactive WebGL
            applications. Building with Three.js, Babylon.js, OpenCASCADE,
            React, and TypeScript.
          </p>
          <p>
            This portfolio showcases projects in real-time 3D visualization,
            CAD geometry processing, Blender tooling, and sports data
            analytics — bridging native performance with modern web
            experiences.
          </p>
        </div>

        {/* スキルカード 4列 */}
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border border-gray-800 bg-gray-900 p-5">
            <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-gray-500">
              Frontend
            </h3>
            <p className="text-sm text-gray-300">
              React, TypeScript, Tailwind CSS
            </p>
          </div>
          <div className="rounded-lg border border-gray-800 bg-gray-900 p-5">
            <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-gray-500">
              3D / WebGL
            </h3>
            <p className="text-sm text-gray-300">
              Three.js, Babylon.js, GLSL, @react-three/fiber
            </p>
          </div>
          <div className="rounded-lg border border-gray-800 bg-gray-900 p-5">
            <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-gray-500">
              Native / CAD
            </h3>
            <p className="text-sm text-gray-300">
              C++, OpenCASCADE, Blender Python
            </p>
          </div>
          <div className="rounded-lg border border-gray-800 bg-gray-900 p-5">
            <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-gray-500">
              Infrastructure
            </h3>
            <p className="text-sm text-gray-300">
              Cloudflare Workers, Vite, CI/CD
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
