import styled from '@emotion/styled';

const Container = styled.div`
  margin-top: 16px;
`;

const Label = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
  color: #6b7280;
  margin-bottom: 8px;
`;

const Terminal = styled.div`
  background-color: #1a1a2e;
  border-radius: 8px;
  padding: 12px 16px;
  font-family: 'Fira Code', 'Consolas', monospace;
  font-size: 13px;
  line-height: 1.8;
  min-height: 60px;
  border: 1px solid #2d2d44;
`;

const Line = styled.div<{ isActive: boolean }>`
  color: ${({ isActive }) => (isActive ? '#4ade80' : '#6b7280')};
  font-weight: ${({ isActive }) => (isActive ? '600' : '400')};
  transition: color 0.2s;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const PlayButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 8px;
  padding: 6px 14px;
  font-size: 12px;
  font-weight: 600;
  color: #ffffff;
  background-color: #374151;
  border: none;
  border-radius: 6px;
  cursor: pointer;

  &:hover {
    background-color: #4b5563;
  }

  &:focus-visible {
    outline: 2px solid #3182f6;
    outline-offset: 2px;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export { Container, Label, Terminal, Line, PlayButton };
