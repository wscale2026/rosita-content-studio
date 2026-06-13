import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Instances, Instance } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';

interface SphereData {
  position: [number, number, number];
  size: number;
  ringIndex: number;
  crossIndex: number;
}

function generateRibbonSpheres(): SphereData[] {
  const spheres: SphereData[] = [];
  const R = 6;
  const r = 2.5;
  const rings = 120;
  const crossSections = 8;
  const twist = 1;

  for (let i = 0; i < rings; i++) {
    const t = (i / rings) * Math.PI * 2;

    const cx = (R + r * Math.cos(t * twist)) * Math.cos(t);
    const cy = (R + r * Math.cos(t * twist)) * Math.sin(t);
    const cz = r * Math.sin(t * twist);

    const dt = 0.001;
    const t2 = t + dt;
    const cx2 = (R + r * Math.cos(t2 * twist)) * Math.cos(t2);
    const cy2 = (R + r * Math.cos(t2 * twist)) * Math.sin(t2);
    const cz2 = r * Math.sin(t2 * twist);
    const tangent = new THREE.Vector3(cx2 - cx, cy2 - cy, cz2 - cz).normalize();

    const up = new THREE.Vector3(0, 0, 1);
    const normal = new THREE.Vector3().crossVectors(tangent, up).normalize();
    const binormal = new THREE.Vector3().crossVectors(tangent, normal).normalize();

    for (let j = 0; j < crossSections; j++) {
      const angle = (j / crossSections) * Math.PI * 2;
      const radius = 0.4 + 0.2 * Math.sin(i * 0.3);

      const offset = new THREE.Vector3()
        .addScaledVector(normal, Math.cos(angle) * radius)
        .addScaledVector(binormal, Math.sin(angle) * radius);

      const pos = new THREE.Vector3(cx, cy, cz).add(offset);
      const size = 0.12 + 0.08 * Math.sin(i * 0.5 + j * 0.8);

      spheres.push({
        position: [pos.x, pos.y, pos.z],
        size,
        ringIndex: i,
        crossIndex: j,
      });
    }
  }
  return spheres;
}

function Sculpture({ mouseRef }: { mouseRef: React.RefObject<{ x: number; y: number }> }) {
  const groupRef = useRef<THREE.Group>(null);

  const spheresData = useMemo(() => generateRibbonSpheres(), []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.008;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.05) * 0.15;
      groupRef.current.rotation.z = Math.cos(state.clock.elapsedTime * 0.03) * 0.08;
    }

    if (mouseRef.current) {
      const targetX = mouseRef.current.x * 2;
      const targetY = mouseRef.current.y * 1.5;
      state.camera.position.x += (targetX - state.camera.position.x) * 0.03;
      state.camera.position.y += (targetY - state.camera.position.y) * 0.03;
      state.camera.lookAt(0, 0, 0);
    }
  });

  return (
    <group ref={groupRef}>
      <Instances limit={spheresData.length}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshPhysicalMaterial
          color="#FF3B6F"
          metalness={0.6}
          roughness={0.3}
          clearcoat={1.0}
          clearcoatRoughness={0.1}
        />
        {spheresData.map((sphere, i) => (
          <Instance
            key={i}
            position={sphere.position}
            scale={sphere.size}
          />
        ))}
      </Instances>
    </group>
  );
}

function CameraController({ mouseRef }: { mouseRef: React.RefObject<{ x: number; y: number }> }) {
  useFrame((state) => {
    if (mouseRef.current) {
      const targetX = mouseRef.current.x * 2;
      const targetY = mouseRef.current.y * 1.5;
      state.camera.position.x += (targetX - state.camera.position.x) * 0.03;
      state.camera.position.y += (targetY - state.camera.position.y) * 0.03;
      state.camera.lookAt(0, 0, 0);
    }
  });
  return null;
}

export default function KineticSculpture() {
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseRef.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
      <Canvas
        camera={{ position: [0, 0, 18], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: false }}
        onCreated={({ gl }) => {
          gl.setClearColor('#FFFFFF');
        }}
      >
        <ambientLight intensity={0.3} color="#FFFFFF" />
        <directionalLight position={[8, 10, 5]} intensity={1.5} color="#FFF5F0" />
        <directionalLight position={[-5, -3, 4]} intensity={0.4} color="#E8F0FF" />
        <directionalLight position={[0, 5, -8]} intensity={0.8} color="#FFFFFF" />

        <Sculpture mouseRef={mouseRef} />
        <CameraController mouseRef={mouseRef} />

        <EffectComposer>
          <Bloom
            intensity={0.3}
            luminanceThreshold={0.8}
            luminanceSmoothing={0.9}
            mipmapBlur
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
