/* eslint-disable react/no-unknown-property */
import { useRef } from 'react';

import { Sphere } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface Props {
  position: [number, number, number];
  isActive: boolean;
}

const Planet3D = ({ position, isActive }: Props) => {
  const meshRef = useRef<THREE.Mesh>(null); // 메인 행성 구체 참조
  const glowRef = useRef<THREE.Mesh>(null); // 내부 빛나는 코어 참조
  const outerGlowRef = useRef<THREE.Mesh>(null); // 외부 Glow 레이어 참조
  const ringRef = useRef<THREE.Group>(null); // 궤도 링 그룹 참조
  const atmosphereRef = useRef<THREE.Mesh>(null); // 대기권 구체 참조

  /**
   * 매 프레임마다 실행되는 애니메이션 로직
   * - 행성 자전 및 흔들림
   * - 코어 맥동 효과
   * - 대기권 회전
   * - 궤도 링 회전 (활성 행성만)
   */
  useFrame((state) => {
    const time = state.clock.elapsedTime;

    // 메인 행성: Y축 자전 + X축 흔들림
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.004;
      meshRef.current.rotation.x = Math.sin(time * 0.3) * 0.08;
    }

    // 내부 코어: 맥동 효과 (활성 행성은 더 강하게)
    if (glowRef.current) {
      glowRef.current.scale.setScalar(
        1 + Math.sin(time * 1.8) * (isActive ? 0.12 : 0.05),
      );
    }

    // 외부 Glow: 맥동 효과 (활성 행성만)
    if (outerGlowRef.current && isActive) {
      outerGlowRef.current.scale.setScalar(1 + Math.sin(time * 2.2) * 0.1);
    }

    // 대기권: 느린 역회전
    if (atmosphereRef.current) {
      atmosphereRef.current.rotation.y -= 0.002;
    }

    // 궤도 링: 회전 (활성 행성만)
    if (ringRef.current && isActive) {
      ringRef.current.rotation.z += 0.002;
    }
  });

  return (
    <group position={position}>
      {/* 외부 Glow 레이어: 활성 행성 주변 발광 효과 */}
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

      {/* 대기권: 행성 주변 투명 레이어 */}
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

      {/* 메인 행성 구체: Physical Material로 입체감 표현 */}
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

      {/* 내부 코어 레이어 1: 중간 크기 발광 구체 */}
      <Sphere ref={glowRef} args={[0.65, 32, 32]}>
        <meshBasicMaterial
          color={isActive ? '#ffffff' : '#d0e0f0'}
          transparent
          opacity={isActive ? 0.4 : 0.15}
        />
      </Sphere>

      {/* 내부 코어 레이어 2: 중앙 밝은 구체 */}
      <Sphere args={[0.4, 24, 24]}>
        <meshBasicMaterial
          color={isActive ? '#ffffff' : '#e0f0ff'}
          transparent
          opacity={isActive ? 0.6 : 0.25}
        />
      </Sphere>

      {/* 활성 행성 궤도 링 그룹 */}
      {isActive && (
        <group ref={ringRef}>
          {/* 메인 링: Physical Material로 입체감 표현 */}
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

          {/* 서브 링: 외곽 보조 링 */}
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

          {/* 파티클 링: 중간 레이어 */}
          <mesh rotation={[Math.PI / 2.4, 0, 0]}>
            <torusGeometry args={[1.95, 0.01, 12, 80]} />
            <meshBasicMaterial color="#a0d0ff" transparent opacity={0.7} />
          </mesh>

          {/* Glow 링: 메인 링 외곽 발광 레이어 */}
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

      {/* 비활성 행성 궤도 링 그룹 */}
      {!isActive && (
        <>
          {/* 메인 링: 기본 토러스 */}
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

          {/* Glow 링: 메인 링 외곽 발광 레이어 */}
          <mesh rotation={[Math.PI / 2.7, 0, 0]}>
            <torusGeometry args={[1.35, 0.025, 16, 100]} />
            <meshBasicMaterial color="#b0c4de" transparent opacity={0.08} />
          </mesh>
        </>
      )}
    </group>
  );
};

export default Planet3D;
