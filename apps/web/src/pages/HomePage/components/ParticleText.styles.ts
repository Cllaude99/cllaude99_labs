import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';

import { mq } from '@cllaude99/ui/design-system/breakpoints';
import { palette } from '@cllaude99/ui/design-system/palette';
import { typography } from '@cllaude99/ui/design-system/typography';

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 120px;
  cursor: pointer;
  touch-action: none;
  pointer-events: auto;

  overflow: hidden;

  canvas {
    display: block;
    position: relative;
    left: 50%;
    transform: translateX(-50%);
  }

  ${mq.tablet} {
    height: 160px;
  }

  ${mq.desktop} {
    height: 200px;
  }
`;

const ScreenReaderOnly = styled.span`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`;

const FallbackWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;

  ${mq.tablet} {
    gap: 10px;
  }

  ${mq.desktop} {
    gap: 16px;
  }
`;

const FallbackTitle = styled.h1`
  ${typography.display3};
  color: ${palette.white};
  background: linear-gradient(to right, ${palette.white}, ${palette.grey400});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  ${mq.tablet} {
    ${typography.display1};
  }
`;

const FallbackSubtitle = styled.p`
  ${typography.title3};
  color: ${palette.grey500};

  ${mq.tablet} {
    ${typography.title2};
  }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const bounce = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(4px); }
`;

const GuideWrapper = styled.div`
  position: absolute;
  bottom: 8px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  pointer-events: none;
  animation: ${fadeIn} 1s ease 2s both;

  ${mq.tablet} {
    bottom: 12px;
  }
`;

const GuideText = styled.span`
  ${typography.caption2};
  color: ${palette.grey500};
  opacity: 0.6;
`;

const MouseIcon = styled.div`
  width: 18px;
  height: 28px;
  border: 1.5px solid ${palette.grey500};
  border-radius: 10px;
  position: relative;
  opacity: 0.5;
  animation: ${bounce} 2s ease-in-out infinite;

  &::after {
    content: '';
    position: absolute;
    top: 6px;
    left: 50%;
    transform: translateX(-50%);
    width: 2px;
    height: 6px;
    background: ${palette.grey500};
    border-radius: 1px;
  }
`;

const BaseText = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-family: 'Black Han Sans', sans-serif;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.2);
  font-size: 22px;
  line-height: 1.4;
  pointer-events: none;
  user-select: none;
  opacity: var(--base-text-opacity, 0);
  transition: opacity 0.4s ease;
  -webkit-mask-image: radial-gradient(
    circle 150px at var(--mouse-x, -9999px) var(--mouse-y, -9999px),
    black 0%,
    transparent 100%
  );
  mask-image: radial-gradient(
    circle 150px at var(--mouse-x, -9999px) var(--mouse-y, -9999px),
    black 0%,
    transparent 100%
  );

  ${mq.tablet} {
    font-size: 38px;
    line-height: 1.35;
  }

  ${mq.desktop} {
    font-size: 55px;
    line-height: 1.3;
  }
`;

export {
  Container,
  ScreenReaderOnly,
  BaseText,
  FallbackWrapper,
  FallbackTitle,
  FallbackSubtitle,
  GuideWrapper,
  GuideText,
  MouseIcon,
};
