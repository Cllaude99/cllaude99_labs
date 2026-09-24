import styled from '@emotion/styled';
import { motion } from 'motion/react';

import { mq } from '@cllaude99/ui/design-system/breakpoints';
import { palette } from '@cllaude99/ui/design-system/palette';
import { typography } from '@cllaude99/ui/design-system/typography';

const PlanetNavZIndex = 20;

export const Nav = styled.nav`
  display: none;

  ${mq.tablet} {
    position: fixed;
    top: 50%;
    right: 24px;
    transform: translateY(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 18px;
    padding: 14px 10px;
    background: linear-gradient(
      135deg,
      rgba(15, 15, 20, 0.55) 0%,
      rgba(10, 10, 15, 0.4) 100%
    );
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 999px;
    backdrop-filter: blur(8px);
    box-shadow:
      0 8px 24px rgba(0, 0, 0, 0.25),
      inset 0 1px 0 rgba(255, 255, 255, 0.08);
    z-index: ${PlanetNavZIndex};
  }
`;

export const DotWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
`;

export const Dot = styled(motion.button)<{ isActive: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  border: none;
  padding: 0;
  cursor: pointer;
  background: ${({ isActive }) =>
    isActive ? palette.blue400 : 'rgba(255, 255, 255, 0.35)'};
  box-shadow: ${({ isActive }) =>
    isActive
      ? `0 0 12px ${palette.blue400}, 0 0 4px rgba(255, 255, 255, 0.6)`
      : 'none'};
  transition: background 0.2s ease;

  &:hover {
    background: ${({ isActive }) =>
      isActive ? palette.blue400 : 'rgba(255, 255, 255, 0.6)'};
  }

  &:focus-visible {
    outline: 2px solid ${palette.blue300};
    outline-offset: 4px;
  }
`;

export const Tooltip = styled(motion.span)`
  ${typography.label2};
  position: absolute;
  right: calc(100% + 14px);
  top: 50%;
  transform: translateY(-50%);
  padding: 6px 10px;
  border-radius: 6px;
  background: rgba(10, 10, 15, 0.92);
  color: ${palette.white};
  border: 1px solid rgba(255, 255, 255, 0.15);
  white-space: nowrap;
  pointer-events: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.35);
`;
