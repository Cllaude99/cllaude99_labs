import { RefObject } from 'react';

import { MotionValue, useSpring, useTransform } from 'motion/react';

const MAGNIFICATION_DISTANCE = 100; // 마우스 영향 범위 (px)
const MAGNIFICATION_SCALE = 1.15; // 최대 확대 배율 (Mac OS 스타일로 축소)
const SPRING_CONFIG = {
  mass: 0.1,
  stiffness: 200,
  damping: 15,
};

const useMagnification = (
  ref: RefObject<HTMLElement>,
  mouseX: MotionValue<number>,
) => {
  /* 마우스와 아이템 중심 간 거리 계산 */
  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect();
    if (!bounds) return MAGNIFICATION_DISTANCE;

    const itemCenterX = bounds.left + bounds.width / 2;
    return Math.abs(val - itemCenterX);
  });

  /* 거리에 따른 스케일 변환 */
  const scale = useTransform(
    distance,
    [0, MAGNIFICATION_DISTANCE],
    [MAGNIFICATION_SCALE, 1],
  );

  /* Spring 애니메이션 적용 */
  const springScale = useSpring(scale, SPRING_CONFIG);

  return { scale: springScale };
};

export default useMagnification;
