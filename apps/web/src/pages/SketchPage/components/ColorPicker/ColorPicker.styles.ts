import styled from '@emotion/styled';

import { ThemeMode } from '../../types';

export const ColorPickerWrapper = styled.div`
  position: relative;
`;

export const CurrentColorButton = styled.button<{
  color: string;
  themeMode: ThemeMode;
}>`
  width: 32px;
  height: 32px;
  border-radius: 4px;
  border: 2px solid
    ${({ themeMode }) => (themeMode === 'light' ? '#e5e5e5' : '#404040')};
  cursor: pointer;
  transition: transform 0.1s;
  background: transparent;

  &:hover {
    transform: scale(1.1);
  }
`;

export const ColorPreview = styled.div<{ color: string }>`
  width: 100%;
  height: 100%;
  border-radius: 2px;
  background: ${({ color }) => color};

  ${({ color }) =>
    color === 'transparent' &&
    `
    background:
      linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc),
      linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc);
    background-size: 8px 8px;
    background-position: 0 0, 4px 4px;
  `}
`;

export const ColorPalette = styled.div<{ themeMode: ThemeMode }>`
  position: absolute;
  top: 40px;
  left: 0;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  padding: 8px;
  background: ${({ themeMode }) =>
    themeMode === 'light' ? '#ffffff' : '#2a2a2a'};
  border: 1px solid
    ${({ themeMode }) => (themeMode === 'light' ? '#e5e5e5' : '#404040')};
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 100;
`;

export const ColorOption = styled.button<{
  color: string;
  isSelected: boolean;
  themeMode: ThemeMode;
}>`
  width: 24px;
  height: 24px;
  border-radius: 4px;
  background: ${({ color }) => color};
  border: 2px solid
    ${({ isSelected, themeMode }) =>
      isSelected ? '#5B8FF9' : themeMode === 'light' ? '#e5e5e5' : '#404040'};
  cursor: pointer;
  transition:
    transform 0.1s,
    border-color 0.1s;

  &:hover {
    transform: scale(1.1);
    border-color: #5b8ff9;
  }

  ${({ color }) =>
    color === 'transparent' &&
    `
    background:
      linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc),
      linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc);
    background-size: 8px 8px;
    background-position: 0 0, 4px 4px;
  `}
`;
