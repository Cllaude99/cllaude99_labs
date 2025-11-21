/* eslint-disable react/no-unknown-property */
import { useRef } from 'react';

import { Sphere } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface Planet3DProps {
  position: [number, number, number];
  isActive: boolean;
}

const Planet3D = ({ position, isActive }: Planet3DProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const outerGlowRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Group>(null);
  const atmosphereRef = useRef<THREE.Mesh>(null);

  // 행성 자전 및 애니메이션
  useFrame((state) => {
    const time = state.clock.elapsedTime;

    if (meshRef.current) {
      meshRef.current.rotation.y += 0.004;
      meshRef.current.rotation.x = Math.sin(time * 0.3) * 0.08;
    }

    if (glowRef.current) {
      glowRef.current.scale.setScalar(
        1 + Math.sin(time * 1.8) * (isActive ? 0.12 : 0.05),
      );
    }

    if (outerGlowRef.current && isActive) {
      outerGlowRef.current.scale.setScalar(
        1 + Math.sin(time * 2.2) * 0.1,
      );
    }

    if (atmosphereRef.current) {
      atmosphereRef.current.rotation.y -= 0.002;
    }

    if (ringRef.current && isActive) {
      ringRef.current.rotation.z += 0.002;
    }
  });

  return (
    <group position={position}>
      {/* 외부 Glow 레이어 (활성 행성만) */}
      {isActive && (
        <Sphere ref={outerGlowRef} args={[1.4, 32, 32]}>
          <meshBasicMaterial
            color="#4a90e2"
            transparent
            opacity={0.08}
            side={THREE.BackSide}
          />
        </Sphere>
      )}

      {/* 대기권 효과 */}
      <Sphere ref={atmosphereRef} args={[1.15, 48, 48]}>
        <meshPhysicalMaterial
          color={isActive ? '#a0d0ff' : '#8898aa'}
          transparent
          opacity={isActive ? 0.15 : 0.08}
          side={THREE.BackSide}
          metalness={0}
          roughness={0.8}
          transmission={0.9}
          thickness={0.3}
        />
      </Sphere>

      {/* 메인 행성 구체 - 더 입체적인 재질 */}
      <Sphere ref={meshRef} args={[1, 64, 64]}>
        <meshPhysicalMaterial
          color={isActive ? '#e8f4ff' : '#b0c4de'}
          metalness={0.3}
          roughness={0.15}
          transmission={0.2}
          thickness={0.8}
          emissive={isActive ? '#4a90e2' : '#6a7b8c'}
          emissiveIntensity={isActive ? 0.6 : 0.2}
          clearcoat={1.2}
          clearcoatRoughness={0.05}
          ior={1.5}
          reflectivity={0.8}
        />
      </Sphere>

      {/* 내부 빛나는 코어 - 더 강렬하게 */}
      <Sphere ref={glowRef} args={[0.65, 32, 32]}>
        <meshBasicMaterial
          color={isActive ? '#ffffff' : '#d0e0f0'}
          transparent
          opacity={isActive ? 0.4 : 0.15}
        />
      </Sphere>

      {/* 중앙 밝은 코어 */}
      <Sphere args={[0.4, 24, 24]}>
        <meshBasicMaterial
          color={isActive ? '#ffffff' : '#e0f0ff'}
          transparent
          opacity={isActive ? 0.6 : 0.25}
        />
      </Sphere>

      {/* 세련된 궤도 링 (활성화된 행성) */}
      {isActive && (
        <group ref={ringRef}>
          {/* 메인 링 - 더 입체적 */}
          <mesh rotation={[Math.PI / 2.4, 0, 0]}>
            <torusGeometry args={[1.8, 0.02, 20, 120]} />
            <meshPhysicalMaterial
              color="#4a90e2"
              transparent
              opacity={0.5}
              emissive="#4a90e2"
              emissiveIntensity={0.4}
              metalness={0.5}
              roughness={0.2}
              clearcoat={0.8}
            />
          </mesh>
          {/* 서브 링 */}
          <mesh rotation={[Math.PI / 2.4, 0, 0]}>
            <torusGeometry args={[2.1, 0.012, 16, 100]} />
            <meshStandardMaterial
              color="#ffffff"
              transparent
              opacity={0.25}
              emissive="#a0d0ff"
              emissiveIntensity={0.15}
            />
          </mesh>
          {/* 반짝이는 파티클 링 */}
          <mesh rotation={[Math.PI / 2.4, 0, 0]}>
            <torusGeometry args={[1.95, 0.01, 12, 80]} />
            <meshBasicMaterial
              color="#a0d0ff"
              transparent
              opacity={0.7}
            />
          </mesh>
          {/* 추가 Glow 링 */}
          <mesh rotation={[Math.PI / 2.4, 0, 0]}>
            <torusGeometry args={[1.8, 0.05, 16, 100]} />
            <meshBasicMaterial
              color="#4a90e2"
              transparent
              opacity={0.15}
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>
      )}

      {/* 비활성 행성용 심플한 링 - 개선 */}
      {!isActive && (
        <>
          <mesh rotation={[Math.PI / 2.7, 0, 0]}>
            <torusGeometry args={[1.35, 0.01, 16, 100]} />
            <meshStandardMaterial
              color="#b0c4de"
              transparent
              opacity={0.2}
              emissive="#b0c4de"
              emissiveIntensity={0.1}
            />
          </mesh>
          <mesh rotation={[Math.PI / 2.7, 0, 0]}>
            <torusGeometry args={[1.35, 0.025, 16, 100]} />
            <meshBasicMaterial
              color="#b0c4de"
              transparent
              opacity={0.08}
            />
          </mesh>
        </>
      )}
    </group>
  );
};

export default Planet3D;
