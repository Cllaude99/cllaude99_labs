import { css } from '@emotion/react';
import styled from '@emotion/styled';

import type { ResizableOrientation } from '../types';

interface HandleStyleProps {
  orientation: ResizableOrientation;
}

const Container = styled.div<HandleStyleProps>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background-color: ${({ theme }) => theme.palette.grey200};
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.palette.blue500};
  }

  &[data-resize-handle-active] {
    background-color: ${({ theme }) => theme.palette.blue600};
  }

  ${({ orientation }) =>
    orientation === 'horizontal'
      ? css`
          width: 4px;
          height: 100%;
          cursor: col-resize;
        `
      : css`
          width: 100%;
          height: 4px;
          cursor: row-resize;
        `}
`;

const GripIcon = styled.div<HandleStyleProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.palette.grey400};
  pointer-events: none;

  ${({ orientation }) =>
    orientation === 'horizontal'
      ? css`
          flex-direction: column;
          gap: 2px;
        `
      : css`
          flex-direction: row;
          gap: 2px;
        `}
`;

const GripDot = styled.span`
  display: block;
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background-color: currentColor;
`;

export { Container, GripIcon, GripDot };
