import styled from '@emotion/styled';

import { ThemeMode } from './types';

interface SketchContainerProps {
  themeMode: ThemeMode;
}

export const SketchContainer = styled.div<SketchContainerProps>`
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background-color: ${({ themeMode }) =>
    themeMode === 'light' ? '#ffffff' : '#1e1e1e'};
`;

export const GridBackground = styled.div<SketchContainerProps>`
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
  z-index: 0;
`;

export const HelpText = styled.div<SketchContainerProps>`
  position: absolute;
  bottom: 16px;
  right: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background-color: ${({ themeMode }) =>
    themeMode === 'light'
      ? 'rgba(255, 255, 255, 0.9)'
      : 'rgba(45, 45, 45, 0.9)'};
  border-radius: 8px;
  font-size: 12px;
  color: ${({ themeMode }) => (themeMode === 'light' ? '#6b7280' : '#9ca3af')};
  box-shadow: ${({ themeMode }) =>
    themeMode === 'light'
      ? '0 2px 8px rgba(0, 0, 0, 0.08)'
      : '0 2px 8px rgba(0, 0, 0, 0.3)'};
  border: 1px solid
    ${({ themeMode }) => (themeMode === 'light' ? '#e5e5e5' : '#404040')};
  z-index: 100;
`;

export const Kbd = styled.kbd<SketchContainerProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  font-size: 11px;
  font-family: inherit;
  font-weight: 500;
  color: ${({ themeMode }) => (themeMode === 'light' ? '#374151' : '#e5e5e5')};
  background-color: ${({ themeMode }) =>
    themeMode === 'light' ? '#f3f4f6' : '#404040'};
  border: 1px solid
    ${({ themeMode }) => (themeMode === 'light' ? '#d1d5db' : '#525252')};
  border-radius: 4px;
`;
