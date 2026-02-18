import styled from '@emotion/styled';

const IconRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  color: #374151;
`;

const IconItemWrapper = styled.div`
  position: relative;
  margin-bottom: 8px;
`;

const SpeechBubble = styled.div<{ variant: 'bad' | 'good' }>`
  position: relative;
  padding: 6px 12px;
  margin-bottom: 6px;
  font-size: 12px;
  font-family: 'Fira Code', 'Consolas', monospace;
  color: ${({ variant }) => (variant === 'bad' ? '#dc2626' : '#16a34a')};
  background-color: ${({ variant }) =>
    variant === 'bad' ? '#fef2f2' : '#f0fdf4'};
  border: 1px solid
    ${({ variant }) => (variant === 'bad' ? '#fecaca' : '#bbf7d0')};
  border-radius: 8px;

  &::after {
    content: '';
    position: absolute;
    bottom: -6px;
    left: 16px;
    width: 0;
    height: 0;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-top: 6px solid
      ${({ variant }) => (variant === 'bad' ? '#fecaca' : '#bbf7d0')};
  }
`;

const ToggleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
`;

const ToggleButton = styled.button<{ isActive: boolean }>`
  padding: 8px 16px;
  font-size: 13px;
  font-weight: 600;
  color: ${({ isActive }) => (isActive ? '#ffffff' : '#374151')};
  background-color: ${({ isActive }) => (isActive ? '#3182f6' : '#f3f4f6')};
  border: 1px solid ${({ isActive }) => (isActive ? '#3182f6' : '#d1d5db')};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: ${({ isActive }) => (isActive ? '#2563eb' : '#e5e7eb')};
  }

  &:focus-visible {
    outline: 2px solid #3182f6;
    outline-offset: 2px;
  }
`;

const ToggleHint = styled.span`
  font-size: 13px;
  color: #6b7280;
`;

export {
  IconRow,
  IconItemWrapper,
  SpeechBubble,
  ToggleRow,
  ToggleButton,
  ToggleHint,
};
