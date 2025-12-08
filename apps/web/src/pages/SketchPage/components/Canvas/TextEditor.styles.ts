import styled from '@emotion/styled';

import { ThemeMode } from '../../types';

export const EditorWrapper = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
`;

export const EditableDiv = styled.div<{
  themeMode: ThemeMode;
  fontSize: number;
}>`
  width: 100%;
  padding: 0;
  font-size: ${({ fontSize }) => fontSize}px;
  font-family:
    'Inter',
    -apple-system,
    BlinkMacSystemFont,
    sans-serif;
  line-height: 1.2;
  text-align: center;
  background: transparent;
  border: none;
  color: ${({ themeMode }) => (themeMode === 'light' ? '#1e1e1e' : '#e5e5e5')};
  caret-color: ${({ themeMode }) =>
    themeMode === 'light' ? '#1e1e1e' : '#e5e5e5'};
  outline: none;
  white-space: pre-wrap;
  word-break: break-word;
  min-width: 1px;

  &:empty::before {
    content: '';
  }
`;

// 이전 TextArea 스타일 (호환성을 위해 유지하되, 사용하지 않음)
export const TextArea = styled.textarea<{
  themeMode: ThemeMode;
  fontSize: number;
}>`
  position: absolute;
  padding: 4px 8px;
  font-size: ${({ fontSize }) => fontSize}px;
  font-family:
    'Inter',
    -apple-system,
    BlinkMacSystemFont,
    sans-serif;
  text-align: center;
  background: transparent;
  border: none;
  color: ${({ themeMode }) => (themeMode === 'light' ? '#1e1e1e' : '#e5e5e5')};
  resize: none;
  outline: none;
  z-index: 200;
  overflow: hidden;
`;
