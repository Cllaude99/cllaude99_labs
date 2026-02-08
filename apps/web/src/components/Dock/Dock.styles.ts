import styled from '@emotion/styled';
import { motion } from 'motion/react';

import { mq } from '@cllaude99/ui/breakpoints';

import { DockPosition } from './types';

interface DockContainerProps {
  position: DockPosition;
  isHovered: boolean;
}

const Z_INDEX = 9999;

const DockContainer = styled(motion.div)<DockContainerProps>`
  position: fixed;
  z-index: ${Z_INDEX};
  display: none;
  gap: ${({ isHovered }) => (isHovered ? '6px' : '4px')};
  padding: ${({ isHovered }) => (isHovered ? '10px 14px' : '6px 10px')};
  background: rgba(10, 10, 15, 0.55);
  backdrop-filter: blur(24px) saturate(200%);
  -webkit-backdrop-filter: blur(24px) saturate(200%);
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow:
    0 4px 24px rgba(0, 0, 0, 0.3),
    0 1px 2px rgba(0, 0, 0, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.08);

  transition:
    gap 0.25s cubic-bezier(0.4, 0, 0.2, 1),
    padding 0.25s cubic-bezier(0.4, 0, 0.2, 1);

  ${mq.tablet} {
    display: flex;

    ${({ position }) => {
      switch (position) {
        case 'bottom':
          return `
            bottom: 16px;
            left: 0;
            right: 0;
            top: auto;
            margin-inline: auto;
            width: fit-content;
            flex-direction: row;
            align-items: flex-end;
          `;
        case 'left':
          return `
            left: 16px;
            top: 0;
            bottom: 0;
            right: auto;
            margin-block: auto;
            height: fit-content;
            flex-direction: column;
            align-items: flex-start;
          `;
      }
    }}
  }
`;

interface DividerProps {
  position: DockPosition;
}

const Divider = styled.div<DividerProps>`
  background: rgba(255, 255, 255, 0.15);
  flex-shrink: 0;

  ${({ position }) => {
    switch (position) {
      case 'bottom':
        return `
          width: 1px;
          height: 36px;
          margin: 0 4px;
        `;
      case 'left':
        return `
          width: 36px;
          height: 1px;
          margin: 4px 0;
        `;
    }
  }}
`;

export { DockContainer, Divider };
