// ヒーロー3Dシーン（R3F Canvas + パーティクル）
import { Canvas } from '@react-three/fiber';
import ParticleMesh from './ParticleMesh';

function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 10], fov: 60 }}
      gl={{ alpha: true, antialias: false, powerPreference: 'high-performance' }}
      dpr={[1, 1.5]}
      style={{ position: 'absolute', inset: 0 }}
    >
      <ParticleMesh />
    </Canvas>
  );
}

export default HeroScene;
