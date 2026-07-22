'use client';

import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// --- 3D Heart Geometry Factory ---
function createHeartGeometry() {
  const heartShape = new THREE.Shape();
  heartShape.moveTo(0, 0);
  // Bezier curve drawing a symmetrical heart shape
  heartShape.bezierCurveTo(0, -0.3, -0.6, -0.3, -0.6, 0.25);
  heartShape.bezierCurveTo(-0.6, 0.7, -0.25, 0.95, 0, 1.25);
  heartShape.bezierCurveTo(0.25, 0.95, 0.6, 0.7, 0.6, 0.25);
  heartShape.bezierCurveTo(0.6, -0.3, 0, -0.3, 0, 0);

  const extrudeSettings = {
    depth: 0.15,
    bevelEnabled: true,
    bevelSegments: 3,
    steps: 1,
    bevelSize: 0.04,
    bevelThickness: 0.04,
  };

  const geometry = new THREE.ExtrudeGeometry(heartShape, extrudeSettings);
  geometry.center(); // Center the heart around its local origin
  return geometry;
}

// --- Component: Starry Sky Background with Mouse Parallax ---
function StarParticles() {
  const pointsRef = useRef<THREE.Points | null>(null);
  const count = 600;

  // Generate random star coordinates
  const [positions, velocities] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vels = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 15; // X
      pos[i * 3 + 1] = (Math.random() - 0.5) * 15; // Y
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10 - 2; // Z (behind camera focus)
      
      vels[i * 3] = (Math.random() - 0.5) * 0.002;
      vels[i * 3 + 1] = (Math.random() - 0.5) * 0.002;
      vels[i * 3 + 2] = (Math.random() - 0.5) * 0.002;
    }
    return [pos, vels];
  }, []);

  useFrame((state) => {
    if (!pointsRef.current) return;

    const geo = pointsRef.current.geometry;
    const posAttr = geo.attributes.position;
    const { pointer } = state;

    // Drifting points and subtle mouse parallax
    for (let i = 0; i < count; i++) {
      let x = posAttr.getX(i);
      let y = posAttr.getY(i);
      let z = posAttr.getZ(i);

      // Add velocity drift
      x += velocities[i * 3];
      y += velocities[i * 3 + 1];
      z += velocities[i * 3 + 2];

      // Wrap-around bounds check
      if (Math.abs(x) > 10) x = -x;
      if (Math.abs(y) > 10) y = -y;
      if (z > 5 || z < -15) velocities[i * 3 + 2] = -velocities[i * 3 + 2];

      posAttr.setXYZ(i, x, y, z);
    }
    posAttr.needsUpdate = true;

    // Smooth camera rotation based on pointer position (mouse parallax)
    pointsRef.current.rotation.y = THREE.MathUtils.lerp(pointsRef.current.rotation.y, pointer.x * 0.2, 0.05);
    pointsRef.current.rotation.x = THREE.MathUtils.lerp(pointsRef.current.rotation.x, -pointer.y * 0.2, 0.05);
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#b1d0e9"
        size={0.03}
        sizeAttenuation={true}
        transparent={true}
        opacity={0.6}
      />
    </points>
  );
}

// --- Component: Rotating 3D Hearts ---
function FloatingHearts({ geometry }: { geometry: THREE.ExtrudeGeometry }) {
  const count = 6;
  const meshRefs = useRef<(THREE.Mesh | null)[]>([]);

  // Generate random data for floating hearts
  const heartData = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => ({
      position: [
        (Math.random() - 0.5) * 8, // X
        (Math.random() - 0.5) * 6, // Y
        (Math.random() - 0.5) * 4 - 2, // Z
      ] as [number, number, number],
      scale: Math.random() * 0.3 + 0.2,
      rotationSpeed: {
        x: (Math.random() - 0.5) * 0.5,
        y: (Math.random() - 0.5) * 0.8,
        z: (Math.random() - 0.5) * 0.3,
      },
      floatOffset: Math.random() * Math.PI * 2,
    }));
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    meshRefs.current.forEach((mesh, index) => {
      if (!mesh) return;
      const data = heartData[index];

      // Rotate hearts
      mesh.rotation.x += data.rotationSpeed.x * 0.01;
      mesh.rotation.y += data.rotationSpeed.y * 0.01;
      mesh.rotation.z += data.rotationSpeed.z * 0.01;

      // Make them float up and down gently
      mesh.position.y = data.position[1] + Math.sin(time * 0.5 + data.floatOffset) * 0.2;
    });
  });

  return (
    <>
      {heartData.map((data, index) => (
        <mesh
          key={index}
          ref={(el) => { meshRefs.current[index] = el; }}
          geometry={geometry}
          position={data.position}
          scale={data.scale}
        >
          <meshStandardMaterial
            color="#ff7b90"
            roughness={0.2}
            metalness={0.1}
            emissive="#73091c"
            emissiveIntensity={0.6}
          />
        </mesh>
      ))}
    </>
  );
}

// --- Component: Interactive Click Spawning Particles ---
interface BurstParticle {
  id: number;
  position: [number, number, number];
  scale: number;
  velocity: [number, number, number];
  opacity: number;
  rotation: [number, number, number];
}

function ClickBurst({ geometry }: { geometry: THREE.ExtrudeGeometry }) {
  const [particles, setParticles] = useState<BurstParticle[]>([]);
  const nextId = useRef(0);
  const { camera } = useThree();

  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent | TouchEvent) => {
      // Get pointer coordinates
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      // Standardize coordinates to normalized device coordinates (-1 to +1)
      const x = (clientX / window.innerWidth) * 2 - 1;
      const y = -(clientY / window.innerHeight) * 2 + 1;

      // Project screen coords to R3F world coordinates at z=0 (camera is at z=5)
      const aspect = window.innerWidth / window.innerHeight;
      const fov = (camera as THREE.PerspectiveCamera).fov || 60;
      const visibleHeight = 2 * Math.tan((fov * Math.PI) / 360) * 5;
      const visibleWidth = visibleHeight * aspect;

      const worldX = x * (visibleWidth / 2);
      const worldY = y * (visibleHeight / 2);

      // Spawn a burst of 4 small hearts at the click point
      const count = 4;
      const newParticles: BurstParticle[] = [];

      for (let i = 0; i < count; i++) {
        newParticles.push({
          id: nextId.current++,
          position: [worldX + (Math.random() - 0.5) * 0.3, worldY + (Math.random() - 0.5) * 0.3, 0],
          scale: Math.random() * 0.08 + 0.04,
          velocity: [
            (Math.random() - 0.5) * 1.5, // Spread speed X
            Math.random() * 2 + 1,       // Rise speed Y
            (Math.random() - 0.5) * 1.0, // Depth drift Z
          ],
          opacity: 1,
          rotation: [Math.random() * Math.PI, Math.random() * Math.PI, 0],
        });
      }

      setParticles((prev) => [...prev, ...newParticles]);
    };

    window.addEventListener('click', handleGlobalClick);
    window.addEventListener('touchstart', handleGlobalClick);

    return () => {
      window.removeEventListener('click', handleGlobalClick);
      window.removeEventListener('touchstart', handleGlobalClick);
    };
  }, [camera]);

  useFrame((state, delta) => {
    if (particles.length === 0) return;

    setParticles((prev) =>
      prev
        .map((p) => {
          // Update position using velocities
          const newPos: [number, number, number] = [
            p.position[0] + p.velocity[0] * delta,
            p.position[1] + p.velocity[1] * delta,
            p.position[2] + p.velocity[2] * delta,
          ];

          // Slowly rotate
          const newRot: [number, number, number] = [
            p.rotation[0] + delta * 2,
            p.rotation[1] + delta * 1.5,
            p.rotation[2],
          ];

          // Fade out and shrink
          return {
            ...p,
            position: newPos,
            rotation: newRot,
            scale: Math.max(0, p.scale - delta * 0.04),
            opacity: Math.max(0, p.opacity - delta * 0.5),
          };
        })
        // Filter out dead particles
        .filter((p) => p.opacity > 0 && p.scale > 0)
    );
  });

  return (
    <>
      {particles.map((p) => (
        <mesh
          key={p.id}
          geometry={geometry}
          position={p.position}
          scale={p.scale}
          rotation={p.rotation}
        >
          <meshBasicMaterial
            color="#ff4d6d"
            transparent={true}
            opacity={p.opacity}
          />
        </mesh>
      ))}
    </>
  );
}

// --- Main 3D Canvas Exporter ---
export default function InteractiveScene() {
  const heartGeometry = useMemo(() => createHeartGeometry(), []);

  return (
    <div className="fixed inset-0 z-0 w-full h-full pointer-events-none select-none overflow-hidden bg-[#050505]">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: false }}
      >
        <color attach="background" args={['#050505']} />
        
        {/* Lights */}
        <ambientLight intensity={0.6} />
        <directionalLight position={[2, 2, 2]} intensity={2.0} color="#ff7b90" />
        <pointLight position={[-2, -2, 2]} intensity={1.5} color="#00f5d4" />
        
        {/* Sub-components */}
        <StarParticles />
        <FloatingHearts geometry={heartGeometry} />
        <ClickBurst geometry={heartGeometry} />
      </Canvas>
    </div>
  );
}
