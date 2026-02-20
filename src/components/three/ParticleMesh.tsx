import { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const DESKTOP_COUNT = 300;
const MOBILE_COUNT = 150;
const CONNECTION_DISTANCE = 2.5;
const DESKTOP_MAX_CONNECTIONS = 5;
const MOBILE_MAX_CONNECTIONS = 3;
const MOUSE_INFLUENCE_RADIUS = 4;
const MOUSE_ATTRACT_STRENGTH = 8;
const SPRING_BACK = 1.5;
const DAMPING_RATE = 3;
const MOUSE_FOLLOW_SPEED = 8;
const PARTICLE_BASE_SIZE = 2;
const PARTICLE_MAX_SIZE_FACTOR = 1.8;
const SPREAD = 8;

function isMobile() {
  return window.innerWidth < 768;
}

function ParticleMesh() {
  const mobile = useMemo(() => isMobile(), []);
  const count = mobile ? MOBILE_COUNT : DESKTOP_COUNT;

  const maxConns = mobile ? MOBILE_MAX_CONNECTIONS : DESKTOP_MAX_CONNECTIONS;

  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  const matRef = useRef<THREE.PointsMaterial>(null);

  // マウス座標（NDC: 生値 / lerp済み）
  const mouseTargetRef = useRef(new THREE.Vector2(0, 0));
  const mouseSmoothedRef = useRef(new THREE.Vector2(0, 0));
  const mouseActiveRef = useRef(false);
  const mouse3DRef = useRef(new THREE.Vector3(0, 0, 0));
  const tmpVec3 = useRef(new THREE.Vector3()); // unproject作業用

  const { camera, gl } = useThree();

  // パーティクル初期配置
  const { positions, vels, basePositions, sizes } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const v = new Float32Array(count * 3);
    const base = new Float32Array(count * 3);
    const sz = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const x = (Math.random() - 0.5) * SPREAD * 2;
      const y = (Math.random() - 0.5) * SPREAD * 1.2;
      const z = (Math.random() - 0.5) * SPREAD * 0.6;
      pos[i3] = x;
      pos[i3 + 1] = y;
      pos[i3 + 2] = z;
      base[i3] = x;
      base[i3 + 1] = y;
      base[i3 + 2] = z;
      v[i3] = (Math.random() - 0.5) * 0.003;
      v[i3 + 1] = (Math.random() - 0.5) * 0.003;
      v[i3 + 2] = (Math.random() - 0.5) * 0.001;
      sz[i] = 1.0;
    }
    return { positions: pos, vels: v, basePositions: base, sizes: sz };
  }, [count]);

  // 接続線バッファ（事前確保）
  const maxLines = count * maxConns;
  const linePositions = useMemo(
    () => new Float32Array(maxLines * 6),
    [maxLines],
  );
  const lineColors = useMemo(
    () => new Float32Array(maxLines * 6),
    [maxLines],
  );

  // ポインタ追跡（R3Fがcanvas親でイベント捕捉するためwindowで取得）
  useEffect(() => {
    const canvas = gl.domElement;

    function onPointerMove(e: PointerEvent) {
      const rect = canvas.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      if (nx >= -1 && nx <= 1 && ny >= -1 && ny <= 1) {
        mouseTargetRef.current.set(nx, ny);
        mouseActiveRef.current = true;
      } else {
        mouseActiveRef.current = false;
      }
    }

    function onPointerGone() {
      mouseActiveRef.current = false;
      mouseTargetRef.current.set(0, 0);
    }

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerGone);
    window.addEventListener('pointercancel', onPointerGone);
    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerGone);
      window.removeEventListener('pointercancel', onPointerGone);
    };
  }, [gl]);

  // aSize attributeをシェーダーに注入（粒子サイズ可変）
  useEffect(() => {
    const mat = matRef.current;
    if (!mat) return;
    mat.onBeforeCompile = (shader) => {
      shader.vertexShader = shader.vertexShader
        .replace(
          'uniform float size;',
          'uniform float size;\nattribute float aSize;',
        )
        .replace(
          'gl_PointSize = size;',
          'gl_PointSize = size * aSize;',
        );
    };
    mat.needsUpdate = true;
  }, []);

  useFrame((_, rawDelta) => {
    const pts = pointsRef.current;
    if (!pts) return;

    const delta = Math.min(rawDelta, 0.05);

    // NDC空間でlerp後、z=0平面にunproject
    const lerpFactor = 1 - Math.exp(-delta * MOUSE_FOLLOW_SPEED);
    mouseSmoothedRef.current.lerp(mouseTargetRef.current, lerpFactor);

    const tmp = tmpVec3.current.set(
      mouseSmoothedRef.current.x,
      mouseSmoothedRef.current.y,
      0.5,
    );
    tmp.unproject(camera);
    const dir = tmp.sub(camera.position).normalize();
    const dist = -camera.position.z / dir.z;
    mouse3DRef.current.copy(camera.position).add(dir.multiplyScalar(dist));

    const posAttr = pts.geometry.attributes.position as THREE.BufferAttribute;
    const posArray = posAttr.array as Float32Array;
    const sizeAttr = pts.geometry.attributes.aSize as THREE.BufferAttribute;
    const sizeArray = sizeAttr.array as Float32Array;

    const mx = mouse3DRef.current.x;
    const my = mouse3DRef.current.y;
    const radiusSq = MOUSE_INFLUENCE_RADIUS * MOUSE_INFLUENCE_RADIUS;
    const damping = Math.exp(-DAMPING_RATE * delta);

    // 速度ベース物理更新
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      // 基準位置への復帰力
      vels[i3] += (basePositions[i3] - posArray[i3]) * SPRING_BACK * delta;
      vels[i3 + 1] += (basePositions[i3 + 1] - posArray[i3 + 1]) * SPRING_BACK * delta;
      vels[i3 + 2] += (basePositions[i3 + 2] - posArray[i3 + 2]) * SPRING_BACK * delta;

      // マウス引力
      const dx = mx - posArray[i3];
      const dy = my - posArray[i3 + 1];
      const distSq = dx * dx + dy * dy;

      if (mouseActiveRef.current && distSq < radiusSq && distSq > 0.01) {
        const d = Math.sqrt(distSq);
        const force = MOUSE_ATTRACT_STRENGTH * (1 - d / MOUSE_INFLUENCE_RADIUS);
        vels[i3] += (dx / d) * force * delta;
        vels[i3 + 1] += (dy / d) * force * delta;

        // 近接度に応じたサイズ変化
        const proximity = 1 - d / MOUSE_INFLUENCE_RADIUS;
        sizeArray[i] = 1.0 + (PARTICLE_MAX_SIZE_FACTOR - 1.0) * proximity;
      } else {
        sizeArray[i] = 1.0;
      }

      // 減衰（fps非依存）
      vels[i3] *= damping;
      vels[i3 + 1] *= damping;
      vels[i3 + 2] *= damping;

      // 位置積分
      posArray[i3] += vels[i3] * delta;
      posArray[i3 + 1] += vels[i3 + 1] * delta;
      posArray[i3 + 2] += vels[i3 + 2] * delta;
    }

    posAttr.needsUpdate = true;
    sizeAttr.needsUpdate = true;

    // 接続線更新
    if (linesRef.current) {
      const lineGeo = linesRef.current.geometry;
      const linePosAttr = lineGeo.attributes.position as THREE.BufferAttribute;
      const lineColAttr = lineGeo.attributes.color as THREE.BufferAttribute;
      const lp = linePosAttr.array as Float32Array;
      const lc = lineColAttr.array as Float32Array;

      const connectionCount = new Uint8Array(count);
      let lineIdx = 0;

      for (let i = 0; i < count && lineIdx < maxLines; i++) {
        if (connectionCount[i] >= maxConns) continue;
        const ix = posArray[i * 3];
        const iy = posArray[i * 3 + 1];
        const iz = posArray[i * 3 + 2];

        for (let j = i + 1; j < count && lineIdx < maxLines; j++) {
          if (connectionCount[i] >= maxConns) break;
          if (connectionCount[j] >= maxConns) continue;

          const jx = posArray[j * 3];
          const jy = posArray[j * 3 + 1];
          const jz = posArray[j * 3 + 2];

          const ddx = ix - jx;
          const ddy = iy - jy;
          const ddz = iz - jz;
          const dSq = ddx * ddx + ddy * ddy + ddz * ddz;

          if (dSq < CONNECTION_DISTANCE * CONNECTION_DISTANCE) {
            const alpha = 1 - Math.sqrt(dSq) / CONNECTION_DISTANCE;
            const idx6 = lineIdx * 6;

            lp[idx6] = ix;
            lp[idx6 + 1] = iy;
            lp[idx6 + 2] = iz;
            lp[idx6 + 3] = jx;
            lp[idx6 + 4] = jy;
            lp[idx6 + 5] = jz;

            // マウス近接で線を明るく
            const midX = (ix + jx) * 0.5;
            const midY = (iy + jy) * 0.5;
            const mDistSq = (midX - mx) * (midX - mx) + (midY - my) * (midY - my);
            const mouseFactor = mouseActiveRef.current && mDistSq < radiusSq
              ? 1.0 + 2.0 * (1 - Math.sqrt(mDistSq) / MOUSE_INFLUENCE_RADIUS)
              : 1.0;

            const c = 0.4 * alpha * mouseFactor;
            lc[idx6] = c;
            lc[idx6 + 1] = c;
            lc[idx6 + 2] = c;
            lc[idx6 + 3] = c;
            lc[idx6 + 4] = c;
            lc[idx6 + 5] = c;

            connectionCount[i]++;
            connectionCount[j]++;
            lineIdx++;
          }
        }
      }

      // 未使用頂点をゼロ埋め
      for (let k = lineIdx * 6; k < lp.length; k++) {
        lp[k] = 0;
        lc[k] = 0;
      }

      lineGeo.setDrawRange(0, lineIdx * 2);
      linePosAttr.needsUpdate = true;
      lineColAttr.needsUpdate = true;
    }
  });

  return (
    <>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
            count={count}
          />
          <bufferAttribute
            attach="attributes-aSize"
            args={[sizes, 1]}
            count={count}
          />
        </bufferGeometry>
        <pointsMaterial
          ref={matRef}
          size={mobile ? 2.5 : PARTICLE_BASE_SIZE}
          color="#9ca3af"
          sizeAttenuation
          transparent
          opacity={0.8}
          depthWrite={false}
        />
      </points>

      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[linePositions, 3]}
            count={maxLines * 2}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[lineColors, 3]}
            count={maxLines * 2}
          />
        </bufferGeometry>
        <lineBasicMaterial
          vertexColors
          transparent
          opacity={0.6}
          depthWrite={false}
        />
      </lineSegments>
    </>
  );
}

export default ParticleMesh;
