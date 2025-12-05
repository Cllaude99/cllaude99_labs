import styled from '@emotion/styled';

import { ThemeMode } from '../../types';

interface ThemedProps {
  themeMode: ThemeMode;
}

export const ZoomControlsContainer = styled.div<ThemedProps>`
  position: absolute;
  bottom: 16px;
  left: 16px;
  display: flex;
  align-items: center;
  gap: 4px;
  z-index: 100;
`;

export const ZoomButtonGroup = styled.div<ThemedProps>`
  display: flex;
  align-items: center;
  gap: 0;
  padding: 4px;
  background-color: ${({ themeMode }) =>
    themeMode === 'light' ? '#ffffff' : '#2d2d2d'};
  border-radius: 8px;
  box-shadow: ${({ themeMode }) =>
    themeMode === 'light'
      ? '0 2px 8px rgba(0, 0, 0, 0.08)'
      : '0 2px 8px rgba(0, 0, 0, 0.3)'};
  border: 1px solid
    ${({ themeMode }) => (themeMode === 'light' ? '#e5e5e5' : '#404040')};
`;

export const ZoomButton = styled.button<ThemedProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 4px;
  background-color: transparent;
  color: ${({ themeMode }) => (themeMode === 'light' ? '#1e1e1e' : '#e5e5e5')};
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background-color: ${({ themeMode }) =>
      themeMode === 'light' ? '#f5f5f5' : '#3a3a3a'};
  }

  &:active {
    transform: scale(0.95);
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

export const ZoomLevel = styled.button<ThemedProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 48px;
  height: 28px;
  padding: 0 8px;
  border: none;
  border-radius: 4px;
  background-color: transparent;
  color: ${({ themeMode }) => (themeMode === 'light' ? '#1e1e1e' : '#e5e5e5')};
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background-color: ${({ themeMode }) =>
      themeMode === 'light' ? '#f5f5f5' : '#3a3a3a'};
  }
`;

export const HistoryButtonGroup = styled.div<ThemedProps>`
  display: flex;
  align-items: center;
  gap: 0;
  padding: 4px;
  background-color: ${({ themeMode }) =>
    themeMode === 'light' ? '#ffffff' : '#2d2d2d'};
  border-radius: 8px;
  box-shadow: ${({ themeMode }) =>
    themeMode === 'light'
      ? '0 2px 8px rgba(0, 0, 0, 0.08)'
      : '0 2px 8px rgba(0, 0, 0, 0.3)'};
  border: 1px solid
    ${({ themeMode }) => (themeMode === 'light' ? '#e5e5e5' : '#404040')};
`;

export const HistoryButton = styled.button<
  ThemedProps & { disabled?: boolean }
>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 4px;
  background-color: transparent;
  color: ${({ themeMode }) => (themeMode === 'light' ? '#1e1e1e' : '#e5e5e5')};
  cursor: pointer;
  transition: all 0.15s ease;
  opacity: ${({ disabled }) => (disabled ? 0.4 : 1)};

  &:hover:not(:disabled) {
    background-color: ${({ themeMode }) =>
      themeMode === 'light' ? '#f5f5f5' : '#3a3a3a'};
  }

  &:disabled {
    cursor: not-allowed;
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;
