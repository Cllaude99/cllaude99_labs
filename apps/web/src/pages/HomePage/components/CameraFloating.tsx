import { useRef } from 'react';

import { useFrame } from '@react-three/fiber';
import { Vector3 } from 'three';

/**
 * 카메라 움직임 애니메이션
 * 현재 위치 기준 상대 오프셋 적용
 */
const CameraFloating = () => {
  const CAMERA_OFFSET = {
    x: 8,
    y: 6,
    z: 9,
  }; // 카메라 오프셋 범위
  const CAMERA_OFFSET_SPEED = 0.08; // 카메라 오프셋 속도
  const lastOffset = useRef(new Vector3(0, 0, 0));

  useFrame((state) => {
    const time = state.clock.elapsedTime;

    // 오프셋 계산
    const offsetX = Math.sin(time * 0.4) * CAMERA_OFFSET.x;
    const offsetY = Math.sin(time * 0.5) * CAMERA_OFFSET.y;
    const offsetZ = Math.cos(time * 0.4) * CAMERA_OFFSET.z;

    // 이전 프레임 대비 변화량
    const deltaX = offsetX - lastOffset.current.x;
    const deltaY = offsetY - lastOffset.current.y;
    const deltaZ = offsetZ - lastOffset.current.z;

    // 카메라 위치 업데이트
    state.camera.position.x += deltaX * CAMERA_OFFSET_SPEED;
    state.camera.position.y += deltaY * CAMERA_OFFSET_SPEED;
    state.camera.position.z += deltaZ * CAMERA_OFFSET_SPEED;

    // 오프셋 저장
    lastOffset.current.set(offsetX, offsetY, offsetZ);
  });

  return null;
};

export default CameraFloating;
