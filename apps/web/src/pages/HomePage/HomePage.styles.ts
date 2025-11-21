import styled from '@emotion/styled';
import { motion } from 'motion/react';

import { palette, typography } from '@cllaude99/ui';

// 컨테이너 (Next.js 공식 문서 배경색)
export const Container = styled.div`
  position: relative;
  min-height: 100vh;
  width: 100%;
  overflow: hidden;
  background: #0a0a0a;
`;

// Next.js 스타일 그리드 배경
export const BackgroundGrid = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: linear-gradient(
      rgba(255, 255, 255, 0.03) 1px,
      transparent 1px
    ),
    linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
  background-size: 64px 64px;
  mask-image: radial-gradient(
    ellipse 80% 50% at 50% 50%,
    #000 10%,
    transparent 100%
  );
`;

// 그라디언트 오버레이
export const GradientOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(
      ellipse 800px 600px at 50% 200px,
      rgba(59, 130, 246, 0.15),
      transparent
    ),
    radial-gradient(
      ellipse 600px 400px at 80% 70%,
      rgba(147, 51, 234, 0.1),
      transparent
    );
  pointer-events: none;
`;

// 콘텐츠 (반응형)
export const Content = styled.div`
  position: relative;
  z-index: 1;
  max-width: 1400px;
  margin: 0 auto;
  padding: 60px 24px 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;
  min-height: 100vh;

  @media (max-width: 1024px) {
    padding: 50px 20px 40px;
    gap: 30px;
  }

  @media (max-width: 768px) {
    padding: 40px 16px 30px;
    gap: 24px;
  }

  @media (max-width: 480px) {
    padding: 30px 12px 20px;
    gap: 20px;
  }
`;

// 헤더 (반응형)
export const Header = styled(motion.div)`
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 20px;
  padding: 0 20px;

  @media (max-width: 768px) {
    gap: 10px;
    margin-bottom: 16px;
    padding: 0 16px;
  }

  @media (max-width: 480px) {
    gap: 8px;
    margin-bottom: 12px;
    padding: 0 12px;
  }

  @media (max-width: 375px) {
    gap: 6px;
    margin-bottom: 10px;
    padding: 0 10px;
  }
`;

export const Title = styled.h1`
  ${typography.display1};
  color: ${palette.white};
  background: linear-gradient(to right, ${palette.white}, ${palette.grey400});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
  font-size: 72px;
  letter-spacing: -0.03em;

  @media (max-width: 1024px) {
    font-size: 64px;
  }

  @media (max-width: 768px) {
    font-size: 48px;
  }

  @media (max-width: 480px) {
    font-size: 36px;
  }
`;

export const Subtitle = styled.p`
  ${typography.title1};
  color: ${palette.grey500};
  margin: 0;

  @media (max-width: 768px) {
    font-size: 16px;
  }

  @media (max-width: 480px) {
    font-size: 14px;
  }
`;

// 행성 시스템 컨테이너 (Three.js Canvas - 반응형)
export const PlanetSystem = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100vw;
  height: 100vh;
  max-width: 100%;
  z-index: 0;
  pointer-events: none;

  canvas {
    pointer-events: auto;
  }
`;

// 궤도 (3D 입체감이 있는 타원 궤도)
export const Orbit = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 700px;
  height: 700px;
  transform: translate(-50%, -50%) rotateX(65deg);
  border: 2px dashed rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  pointer-events: none;
  animation: orbitRotate 60s linear infinite;
  box-shadow:
    inset 0 0 30px rgba(255, 255, 255, 0.03),
    0 10px 40px rgba(0, 0, 0, 0.3);

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 102%;
    height: 102%;
    transform: translate(-50%, -50%);
    border-radius: 50%;
    background: radial-gradient(
      ellipse at 50% 30%,
      rgba(255, 255, 255, 0.02) 0%,
      transparent 50%
    );
    pointer-events: none;
  }

  @keyframes orbitRotate {
    from {
      transform: translate(-50%, -50%) rotateX(65deg) rotateZ(0deg);
    }
    to {
      transform: translate(-50%, -50%) rotateX(65deg) rotateZ(360deg);
    }
  }

  @media (max-width: 768px) {
    width: 500px;
    height: 500px;
  }
`;

// 행성 회전 래퍼
export const PlanetsWrapper = styled.div<{ rotation: number }>`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 700px;
  height: 700px;
  transform-style: preserve-3d;
  transform: translate(-50%, -50%) rotateX(65deg)
    rotateZ(${({ rotation }) => rotation}deg);
  transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);

  @media (max-width: 768px) {
    width: 500px;
    height: 500px;
  }
`;

// 개별 행성 컨테이너
export const PlanetContainer = styled.div<{ index: number; total: number }>`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transform: translate(-50%, -50%)
    rotateZ(${({ index, total }) => (360 / total) * index}deg);
`;

// 행성 (3D 입체감 강화)
export const Planet = styled(motion.div)<{
  isActive: boolean;
}>`
  position: absolute;
  top: -140px;
  left: 50%;
  width: 280px;
  height: 280px;
  transform: translate(-50%, 0) rotateX(-65deg);
  pointer-events: none;
  transition: all 0.3s ease;
  filter: ${({ isActive }) =>
    isActive ? 'drop-shadow(0 0 30px rgba(255, 255, 255, 0.2))' : 'none'};

  // 외부 원 (3D 효과)
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: ${({ isActive }) =>
      isActive
        ? '3px solid rgba(255, 255, 255, 0.25)'
        : '2px solid rgba(255, 255, 255, 0.08)'};
    border-radius: 50%;
    transition: all 0.3s ease;
    background: ${({ isActive }) =>
      isActive
        ? 'radial-gradient(ellipse at 30% 30%, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 40%, transparent 70%)'
        : 'radial-gradient(ellipse at 30% 30%, rgba(255, 255, 255, 0.03) 0%, transparent 60%)'};
    box-shadow: ${({ isActive }) =>
      isActive
        ? 'inset 10px 10px 30px rgba(255, 255, 255, 0.05), inset -10px -10px 30px rgba(0, 0, 0, 0.3), 0 0 50px rgba(255, 255, 255, 0.1)'
        : 'inset 5px 5px 15px rgba(255, 255, 255, 0.02), inset -5px -5px 15px rgba(0, 0, 0, 0.2)'};
  }

  // 내부 점선 원 (깊이감 강화)
  &::after {
    content: '';
    position: absolute;
    top: 15%;
    left: 15%;
    width: 70%;
    height: 70%;
    border: ${({ isActive }) =>
      isActive
        ? '1px dashed rgba(255, 255, 255, 0.18)'
        : '1px dashed rgba(255, 255, 255, 0.05)'};
    border-radius: 50%;
    transition: all 0.3s ease;
    box-shadow: ${({ isActive }) =>
      isActive
        ? 'inset 0 0 20px rgba(255, 255, 255, 0.03)'
        : 'none'};
  }

  @media (max-width: 768px) {
    width: 200px;
    height: 200px;
    top: -100px;
  }
`;

// 행성 중심점 (3D 구체 느낌)
export const PlanetIcon = styled.div<{ isActive: boolean }>`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotateX(65deg);
  width: ${({ isActive }) => (isActive ? '16px' : '8px')};
  height: ${({ isActive }) => (isActive ? '16px' : '8px')};
  background: ${({ isActive }) =>
    isActive
      ? 'radial-gradient(circle at 35% 35%, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.6) 40%, rgba(255, 255, 255, 0.2) 80%)'
      : 'radial-gradient(circle at 35% 35%, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.2))'};
  border-radius: 50%;
  transition: all 0.3s ease;
  box-shadow: ${({ isActive }) =>
    isActive
      ? '0 0 25px rgba(255, 255, 255, 0.6), inset -2px -2px 6px rgba(0, 0, 0, 0.3), inset 2px 2px 6px rgba(255, 255, 255, 0.3)'
      : 'inset -1px -1px 3px rgba(0, 0, 0, 0.2), inset 1px 1px 3px rgba(255, 255, 255, 0.2)'};

  @media (max-width: 768px) {
    width: ${({ isActive }) => (isActive ? '12px' : '6px')};
    height: ${({ isActive }) => (isActive ? '12px' : '6px')};
  }
`;

// 프로젝트 정보 패널 (고급스럽게 투명한 글래스모피즘 - 반응형)
export const ProjectInfo = styled(motion.div)`
  position: relative;
  z-index: 10;
  width: 100%;
  max-width: 550px;
  background: linear-gradient(
    135deg,
    rgba(15, 15, 20, 0.45) 0%,
    rgba(10, 10, 15, 0.35) 100%
  );
  backdrop-filter: blur(12px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 24px;
  padding: 30px 36px;
  text-align: center;
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.25),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  margin-top: auto;
  margin-bottom: 30px;
  will-change: opacity, transform;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 24px;
    padding: 1px;
    background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.15),
      rgba(255, 255, 255, 0.05)
    );
    -webkit-mask:
      linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    pointer-events: none;
  }

  @media (max-width: 1200px) {
    max-width: 520px;
    padding: 28px 34px;
  }

  @media (max-width: 1024px) {
    max-width: 480px;
    padding: 26px 32px;
    margin-bottom: 28px;
  }

  @media (max-width: 768px) {
    padding: 20px 24px;
    max-width: 90%;
    background: linear-gradient(
      135deg,
      rgba(15, 15, 20, 0.6) 0%,
      rgba(10, 10, 15, 0.5) 100%
    );
    margin-bottom: 24px;
    border-radius: 20px;
  }

  @media (max-width: 480px) {
    padding: 18px 20px;
    max-width: 92%;
    margin-bottom: 20px;
    border-radius: 16px;
    background: linear-gradient(
      135deg,
      rgba(15, 15, 20, 0.65) 0%,
      rgba(10, 10, 15, 0.55) 100%
    );
  }

  @media (max-width: 375px) {
    padding: 16px 18px;
    max-width: 94%;
    margin-bottom: 18px;
    border-radius: 14px;
  }
`;

export const ProjectTitle = styled.h2`
  ${typography.display2};
  color: ${palette.white};
  margin: 0 0 14px 0;

  @media (max-width: 1200px) {
    font-size: 42px;
    margin: 0 0 13px 0;
  }

  @media (max-width: 1024px) {
    font-size: 38px;
    margin: 0 0 12px 0;
  }

  @media (max-width: 768px) {
    font-size: 30px;
    margin: 0 0 11px 0;
  }

  @media (max-width: 480px) {
    font-size: 26px;
    margin: 0 0 10px 0;
  }

  @media (max-width: 375px) {
    font-size: 24px;
    margin: 0 0 9px 0;
  }
`;

export const ProjectDescription = styled.p`
  ${typography.title1};
  color: ${palette.grey300};
  margin: 0 0 28px 0;
  line-height: 1.6;

  @media (max-width: 1200px) {
    font-size: 19px;
    margin: 0 0 26px 0;
  }

  @media (max-width: 1024px) {
    font-size: 17px;
    margin: 0 0 24px 0;
  }

  @media (max-width: 768px) {
    font-size: 15px;
    margin: 0 0 22px 0;
    line-height: 1.55;
    white-space: pre-line;
  }

  @media (max-width: 480px) {
    font-size: 14px;
    margin: 0 0 20px 0;
    line-height: 1.5;
    white-space: pre-line;
  }

  @media (max-width: 375px) {
    font-size: 13px;
    margin: 0 0 18px 0;
    line-height: 1.5;
    white-space: pre-line;
  }
`;

// 기술 스택 (반응형)
export const TechStackWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
  margin-bottom: 32px;

  @media (max-width: 768px) {
    flex-wrap: nowrap;
    overflow-x: auto;
    justify-content: flex-start;
    gap: 8px;
    margin-bottom: 24px;
    padding: 4px 0;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* IE and Edge */

    &::-webkit-scrollbar {
      display: none; /* Chrome, Safari, Opera */
    }
  }

  @media (max-width: 480px) {
    gap: 8px;
    margin-bottom: 20px;
  }
`;

export const TechBadge = styled.span`
  ${typography.label2};
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: ${palette.grey200};
  padding: 8px 16px;
  border-radius: 8px;
  backdrop-filter: blur(10px);
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
    border-color: rgba(255, 255, 255, 0.3);
  }

  @media (max-width: 768px) {
    padding: 6px 12px;
    font-size: 13px;
    white-space: nowrap;
    flex-shrink: 0;
  }

  @media (max-width: 480px) {
    padding: 5px 10px;
    font-size: 12px;
    border-radius: 6px;
    white-space: nowrap;
    flex-shrink: 0;
  }
`;

// 시작하기 버튼 (반응형)
export const StartButton = styled(motion.button)`
  ${typography.title2};
  width: 100%;
  color: ${palette.white};
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 18px 32px;
  border-radius: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
    border-color: rgba(255, 255, 255, 0.3);
    transform: translateY(-2px);
  }

  @media (max-width: 768px) {
    padding: 14px 24px;
    font-size: 15px;
    border-radius: 12px;
  }

  @media (max-width: 480px) {
    padding: 12px 20px;
    font-size: 14px;
    border-radius: 10px;
    gap: 8px;
  }

  @media (max-width: 375px) {
    padding: 10px 18px;
    font-size: 13px;
    border-radius: 8px;
    gap: 6px;
  }
`;

export const ArrowIcon = styled.span`
  display: inline-block;
  transition: transform 0.3s ease;

  ${StartButton}:hover & {
    transform: translateX(4px);
  }
`;

// 컨트롤 영역 (반응형)
export const Controls = styled.div`
  position: relative;
  z-index: 15;
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
  pointer-events: auto;

  @media (max-width: 768px) {
    gap: 16px;
  }

  @media (max-width: 480px) {
    gap: 14px;
  }
`;

// 단일 방향 네비게이션 버튼 (반응형)
export const NavigationButton = styled(motion.button)`
  ${typography.title2};
  color: ${palette.white};
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 14px 32px;
  border-radius: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.2);
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    padding: 12px 28px;
    font-size: 16px;
    border-radius: 14px;
  }

  @media (max-width: 480px) {
    padding: 10px 24px;
    font-size: 15px;
    border-radius: 12px;
    gap: 6px;
  }
`;

// 인디케이터 (반응형)
export const Indicators = styled.div`
  position: relative;
  z-index: 20;
  display: flex;
  gap: 12px;
  align-items: center;
  pointer-events: auto;

  @media (max-width: 480px) {
    gap: 10px;
  }
`;

export const Indicator = styled.button<{ isActive: boolean }>`
  position: relative;
  z-index: 20;
  width: ${({ isActive }) => (isActive ? '32px' : '12px')};
  height: 12px;
  border-radius: 6px;
  border: none;
  background: ${({ isActive }) =>
    isActive ? palette.white : 'rgba(255, 255, 255, 0.3)'};
  cursor: pointer;
  transition: all 0.3s ease;
  pointer-events: auto;

  &:hover {
    background: ${({ isActive }) =>
      isActive ? palette.white : 'rgba(255, 255, 255, 0.5)'};
  }

  @media (max-width: 480px) {
    width: ${({ isActive }) => (isActive ? '28px' : '10px')};
    height: 10px;
  }
`;

// 푸터 (반응형)
export const Footer = styled(motion.div)`
  text-align: center;
  margin-top: auto;
  padding-top: 40px;

  @media (max-width: 768px) {
    padding-top: 30px;
  }

  @media (max-width: 480px) {
    padding-top: 24px;
  }
`;

export const FooterText = styled.p`
  ${typography.body2};
  color: ${palette.grey600};
  margin: 0;

  @media (max-width: 768px) {
    font-size: 13px;
  }

  @media (max-width: 480px) {
    font-size: 12px;
  }
`;
