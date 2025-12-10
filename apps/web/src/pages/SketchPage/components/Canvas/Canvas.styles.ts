import styled from '@emotion/styled';

import { ThemeMode } from '../../types';

interface CanvasContainerProps {
  themeMode: ThemeMode;
  isRotating?: boolean;
}

export const CanvasContainer = styled.div<CanvasContainerProps>`
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: ${({ themeMode }) =>
    themeMode === 'light' ? '#ffffff' : '#1e1e1e'};
  cursor: ${({ isRotating, className }) =>
    isRotating
      ? 'grabbing'
      : className?.includes('grabbing')
        ? 'grabbing'
        : className?.includes('grab')
          ? 'grab'
          : 'default'} !important;

  /* 회전 중일 때 모든 자식 요소에도 grabbing 커서 적용 */
  ${({ isRotating }) =>
    isRotating &&
    `
    & * {
      cursor: grabbing !important;
    }
  `}
`;

export const GridPattern = styled.div<CanvasContainerProps>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  background-image: ${({ themeMode }) =>
    themeMode === 'light'
      ? `radial-gradient(circle, #d4d4d4 1px, transparent 1px)`
      : `radial-gradient(circle, #3a3a3a 1px, transparent 1px)`};
  background-size: 20px 20px;
`;
