import { css, keyframes } from '@emotion/react';
import styled from '@emotion/styled';

import { DockPosition } from '../../types';

/* Dock이 하단에 있을 때: 아래 중앙으로 쏙 들어감 */
const minimizeToBottom = keyframes`
  0% {
    opacity: 1;
    transform: scale(1) translate(0, 0);
  }
  100% {
    opacity: 0;
    transform: scale(0.1) translate(0, calc(50vh - 20px));
  }
`;

/* Dock이 좌측에 있을 때: 왼쪽으로 쏙 들어감 */
const minimizeToLeft = keyframes`
  0% {
    opacity: 1;
    transform: scale(1) translate(0, 0);
  }
  100% {
    opacity: 0;
    transform: scale(0.1) translate(calc(-50vw + 30px), 0);
  }
`;

interface ContainerProps {
  isMinimizing: boolean;
  dockPosition: DockPosition;
}

const Container = styled.div<ContainerProps>`
  ${({ isMinimizing, dockPosition }) =>
    isMinimizing &&
    css`
      animation: ${dockPosition === 'bottom'
          ? minimizeToBottom
          : minimizeToLeft}
        0.35s cubic-bezier(0.4, 0, 0.6, 1) forwards;
    `}
`;

interface TerminalProps {
  isFullscreen: boolean;
}

const Terminal = styled.div<TerminalProps>`
  background: #1e1e1e;
  font-family: 'Monaco', 'Menlo', 'Courier New', monospace;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  ${({ isFullscreen }) =>
    isFullscreen
      ? css`
          width: 95vw;
          height: 90vh;
          max-width: none;
          border-radius: 12px;
        `
      : css`
          width: 90vw;
          max-width: 800px;
          height: 500px;
          border-radius: 12px;
        `}
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: #2d2d2d;
  border-radius: 12px 12px 0 0;
  border-bottom: 1px solid #404040;
  flex-shrink: 0;
`;

const TrafficLights = styled.div`
  display: flex;
  gap: 8px;
  min-width: 52px;
`;

const TrafficLight = styled.button<{ color: string }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  background: ${({ color }) => {
    switch (color) {
      case 'red':
        return '#ff5f56';
      case 'yellow':
        return '#ffbd2e';
      case 'green':
        return '#27c93f';
      default:
        return '#555';
    }
  }};
  transition: all 0.15s ease;

  &:hover {
    filter: brightness(1.1);
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const Title = styled.div`
  ${({ theme }) => theme.typography.label2};
  color: ${({ theme }) => theme.palette.grey400};
  text-align: center;
  flex: 1;
`;

const HeaderSpacer = styled.div`
  min-width: 52px;
`;

const TerminalHistory = styled.div`
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  color: #d4d4d4;
  ${({ theme }) => theme.typography.body3};

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: #404040;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
`;

const Entry = styled.div`
  margin-bottom: 16px;
`;

const Command = styled.div`
  color: #4ec9b0;
  margin-bottom: 8px;
`;

const CommandOutput = styled.pre`
  color: #d4d4d4;
  white-space: pre-wrap;
  word-wrap: break-word;
  margin: 0;
  font-family: inherit;
  line-height: 1.5;
`;

const UserPromptForm = styled.form`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  background: #252525;
  border-radius: 0 0 12px 12px;
  border-top: 1px solid #404040;
  flex-shrink: 0;
`;

const PromptLogo = styled.span`
  color: #4ec9b0;
  ${({ theme }) => theme.typography.body2Bold};
`;

const UserPromptInput = styled.input`
  flex: 1;
  background: none;
  border: none;
  outline: none;
  color: #d4d4d4;
  ${({ theme }) => theme.typography.body3};
  font-family: inherit;

  &::placeholder {
    color: #6a6a6a;
  }
`;

export {
  Container,
  Terminal,
  Header,
  TrafficLights,
  TrafficLight,
  Title,
  HeaderSpacer,
  TerminalHistory,
  Entry,
  Command,
  CommandOutput,
  UserPromptForm,
  PromptLogo,
  UserPromptInput,
};
