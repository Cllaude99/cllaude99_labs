import styled from '@emotion/styled';

import { ThemeMode } from '../../types';

interface ThemedProps {
  themeMode: ThemeMode;
}

export const ToolbarContainer = styled.div<ThemedProps>`
  position: absolute;
  top: 16px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 8px;
  background-color: ${({ themeMode }) =>
    themeMode === 'light' ? '#ffffff' : '#2d2d2d'};
  border-radius: 12px;
  box-shadow: ${({ themeMode }) =>
    themeMode === 'light'
      ? '0 2px 12px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.05)'
      : '0 2px 12px rgba(0, 0, 0, 0.3), 0 1px 3px rgba(0, 0, 0, 0.2)'};
  border: 1px solid
    ${({ themeMode }) => (themeMode === 'light' ? '#e5e5e5' : '#404040')};
  z-index: 100;
`;

export const Divider = styled.div<ThemedProps>`
  width: 1px;
  height: 24px;
  background-color: ${({ themeMode }) =>
    themeMode === 'light' ? '#e5e5e5' : '#404040'};
  margin: 0 4px;
`;

interface ToolButtonProps extends ThemedProps {
  isActive?: boolean;
  disabled?: boolean;
}

export const ToolButton = styled.button<ToolButtonProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 8px;
  background-color: ${({ isActive, themeMode }) =>
    isActive
      ? '#3182F6'
      : themeMode === 'light'
        ? 'transparent'
        : 'transparent'};
  color: ${({ isActive, themeMode }) =>
    isActive ? '#ffffff' : themeMode === 'light' ? '#1e1e1e' : '#e5e5e5'};
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  opacity: ${({ disabled }) => (disabled ? 0.4 : 1)};
  transition: all 0.15s ease;

  &:hover {
    background-color: ${({ isActive, disabled, themeMode }) =>
      disabled
        ? 'transparent'
        : isActive
          ? '#2272EB'
          : themeMode === 'light'
            ? '#f5f5f5'
            : '#3a3a3a'};
    transform: ${({ disabled }) => (disabled ? 'none' : 'scale(1.05)')};
  }

  &:active {
    transform: ${({ disabled }) => (disabled ? 'none' : 'scale(0.98)')};
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

export const Tooltip = styled.span<ThemedProps>`
  position: absolute;
  bottom: -32px;
  left: 50%;
  transform: translateX(-50%);
  padding: 4px 8px;
  font-size: 12px;
  font-weight: 500;
  color: ${({ themeMode }) => (themeMode === 'light' ? '#ffffff' : '#1e1e1e')};
  background-color: ${({ themeMode }) =>
    themeMode === 'light' ? '#1e1e1e' : '#ffffff'};
  border-radius: 4px;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: all 0.15s ease;
  pointer-events: none;

  &::before {
    content: '';
    position: absolute;
    top: -4px;
    left: 50%;
    transform: translateX(-50%);
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    border-bottom: 4px solid
      ${({ themeMode }) => (themeMode === 'light' ? '#1e1e1e' : '#ffffff')};
  }
`;

export const ToolButtonWrapper = styled.div`
  position: relative;

  &:hover ${Tooltip} {
    opacity: 1;
    visibility: visible;
  }
`;

export const ThemeToggleButton = styled.button<ThemedProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 8px;
  background-color: transparent;
  color: ${({ themeMode }) => (themeMode === 'light' ? '#1e1e1e' : '#e5e5e5')};
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background-color: ${({ themeMode }) =>
      themeMode === 'light' ? '#f5f5f5' : '#3a3a3a'};
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.98);
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;
