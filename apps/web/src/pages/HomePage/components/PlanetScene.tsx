/* eslint-disable react/no-unknown-property */
import { useCallback } from 'react';

import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Vector3 } from 'three';

import Planet3D from './Planet3D';

interface Props {
  currentIndex: number;
  projectsLength: number;
  onPlanetClick: (index: number) => void;
}

const PlanetScene = ({
  currentIndex,
  projectsLength,
  onPlanetClick,
}: Props) => {
  const PLANET_RADIUS = 28; // 행성 배치 반지름
  const ORBIT_RADIUS = 28; // 궤도 링 반지름
  const CAMERA_SETTINGS = { position: [0, 8, 40], fov: 70 }; // 카메라 위치 및 시야각 설정

  /**
   * 원형 궤도 상의 행성 위치 계산
   * @param index - 행성 인덱스
   * @param total - 전체 행성 개수
   * @returns [x, y, z] 좌표
   */
  const getPlanetPosition = useCallback(
    (index: number, total: number): [number, number, number] => {
      const angle = (index / total) * Math.PI * 2;
      return [
        Math.sin(angle) * PLANET_RADIUS,
        0,
        Math.cos(angle) * PLANET_RADIUS,
      ];
    },
    [],
  );

  return (
    <Canvas
      style={{
        width: '100%',
        height: '100%',
        background: 'transparent',
        position: 'absolute',
        top: '0',
        left: '0',
        pointerEvents: 'auto',
      }}
    >
      {/* 기본 카메라 설정 */}
      <PerspectiveCamera
        makeDefault
        position={CAMERA_SETTINGS.position as unknown as Vector3}
        fov={CAMERA_SETTINGS.fov}
      />

      {/* 궤도 제어: 줌 비활성화, 자동 회전 활성화 */}
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        enableRotate={true}
        autoRotate={true}
        autoRotateSpeed={0.8}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 2.2}
      />

      {/* 전역 주변광 */}
      <ambientLight intensity={0.4} />

      {/* 메인 방향광 (그림자 생성) */}
      <directionalLight position={[15, 18, 12]} intensity={1.5} castShadow />

      {/* 보조 방향광 (청색 계열) */}
      <directionalLight
        position={[-8, 10, -6]}
        intensity={0.6}
        color="#8ab4f8"
      />

      {/* 포인트 라이트 - 왼쪽 하단 */}
      <pointLight position={[-12, -10, -8]} intensity={0.8} color="#4a90e2" />

      {/* 포인트 라이트 - 오른쪽 상단 */}
      <pointLight position={[8, 8, 15]} intensity={0.6} color="#a0d0ff" />

      {/* 포인트 라이트 - 중앙 하단 */}
      <pointLight position={[0, -5, 10]} intensity={0.4} color="#6a8caf" />

      {/* 반구 조명 (상단: 흰색, 하단: 어두운 청색) */}
      <hemisphereLight color="#ffffff" groundColor="#0f1419" intensity={0.8} />

      {/* 스포트라이트 (상단 중앙) */}
      <spotLight
        position={[0, 25, 0]}
        angle={0.8}
        penumbra={0.5}
        intensity={0.5}
        color="#ffffff"
      />

      {/* 프로젝트 개수만큼 행성 렌더링 */}
      {[...Array(projectsLength)].map((_, index) => (
        <group
          key={index}
          onClick={() => onPlanetClick(index)}
          onPointerOver={(e) => {
            e.stopPropagation();
            document.body.style.cursor = 'pointer';
          }}
          onPointerOut={() => {
            document.body.style.cursor = 'default';
          }}
        >
          <Planet3D
            position={getPlanetPosition(index, projectsLength)}
            isActive={index === currentIndex}
          />
        </group>
      ))}

      {/* 메인 궤도 링 (토러스 형태, 청색 발광) */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[ORBIT_RADIUS, 0.025, 16, 128]} />
        <meshStandardMaterial
          color="#4a90e2"
          transparent
          opacity={0.12}
          emissive="#4a90e2"
          emissiveIntensity={0.1}
        />
      </mesh>

      {/* 서브 궤도 링 (토러스 형태, 흰색 투명) */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[ORBIT_RADIUS, 0.015, 16, 128]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.06} />
      </mesh>
    </Canvas>
  );
};

export default PlanetScene;
