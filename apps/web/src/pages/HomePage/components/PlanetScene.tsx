/* eslint-disable react/no-unknown-property */
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';

import Planet3D from './Planet3D';

interface PlanetSceneProps {
  currentIndex: number;
  totalProjects: number;
  onPlanetClick: (index: number) => void;
}

const PlanetScene = ({
  currentIndex,
  totalProjects,
  onPlanetClick,
}: PlanetSceneProps) => {
  // 화면 크기에 따라 궤도 크기 동적 조정
  const getOrbitRadius = () => {
    if (typeof window === 'undefined') return 28;
    const width = window.innerWidth;
    if (width <= 375) return 12; // 매우 작은 모바일
    if (width <= 480) return 15; // 작은 모바일
    if (width <= 768) return 18; // 태블릿
    if (width <= 1024) return 22; // 작은 데스크톱
    return 28; // 큰 데스크톱
  };

  const getPlanetPosition = (
    index: number,
    total: number,
  ): [number, number, number] => {
    const angle = (index / total) * Math.PI * 2;
    const radius = getOrbitRadius();
    return [Math.sin(angle) * radius, 0, Math.cos(angle) * radius];
  };

  // 화면 크기에 따른 카메라 설정
  const getCameraSettings = (): {
    position: [number, number, number];
    fov: number;
  } => {
    if (typeof window === 'undefined') return { position: [0, 8, 40], fov: 65 };
    const width = window.innerWidth;
    if (width <= 375) return { position: [0, 6, 20], fov: 75 }; // 매우 작은 모바일
    if (width <= 480) return { position: [0, 7, 25], fov: 70 }; // 작은 모바일
    if (width <= 768) return { position: [0, 7, 30], fov: 68 }; // 태블릿
    if (width <= 1024) return { position: [0, 8, 35], fov: 66 }; // 작은 데스크톱
    return { position: [0, 8, 40], fov: 70 }; // 큰 데스크톱
  };

  const cameraSettings = getCameraSettings();
  const orbitRadius = getOrbitRadius();

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
      {/* 카메라 설정 - 반응형 시야 */}
      <PerspectiveCamera
        makeDefault
        position={cameraSettings.position}
        fov={cameraSettings.fov}
      />
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        enableRotate={true}
        autoRotate={true}
        autoRotateSpeed={0.4}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 2.2}
      />

      {/* 조명 설정 - 입체감을 위한 다층 조명 */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[15, 18, 12]} intensity={1.5} castShadow />
      <directionalLight
        position={[-8, 10, -6]}
        intensity={0.6}
        color="#8ab4f8"
      />
      <pointLight position={[-12, -10, -8]} intensity={0.8} color="#4a90e2" />
      <pointLight position={[8, 8, 15]} intensity={0.6} color="#a0d0ff" />
      <pointLight position={[0, -5, 10]} intensity={0.4} color="#6a8caf" />
      <hemisphereLight color="#ffffff" groundColor="#0f1419" intensity={0.8} />
      <spotLight
        position={[0, 25, 0]}
        angle={0.8}
        penumbra={0.5}
        intensity={0.5}
        color="#ffffff"
      />

      {/* 행성들 */}
      {Array.from({ length: totalProjects }).map((_, index) => (
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
            position={getPlanetPosition(index, totalProjects)}
            isActive={index === currentIndex}
          />
        </group>
      ))}

      {/* 중앙 궤도 링 - 반응형 크기 */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[orbitRadius, 0.045, 16, 128]} />
        <meshStandardMaterial
          color="#4a90e2"
          transparent
          opacity={0.12}
          emissive="#4a90e2"
          emissiveIntensity={0.1}
        />
      </mesh>
      {/* 서브 궤도 링 */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[orbitRadius, 0.03, 16, 128]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.06} />
      </mesh>
    </Canvas>
  );
};

export default PlanetScene;
