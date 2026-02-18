import styled from '@emotion/styled';

const TabList = styled.div`
  display: flex;
  gap: 4px;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 0;
  margin-bottom: 12px;
`;

const TabButton = styled.button<{ isActive: boolean }>`
  padding: 8px 16px;
  font-size: 14px;
  font-weight: ${({ isActive }) => (isActive ? '600' : '400')};
  color: ${({ isActive }) => (isActive ? '#3182f6' : '#6b7280')};
  background: none;
  border: none;
  border-bottom: 2px solid
    ${({ isActive }) => (isActive ? '#3182f6' : 'transparent')};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    color: #3182f6;
  }

  &:focus-visible {
    outline: 2px solid #3182f6;
    outline-offset: -2px;
  }
`;

const TabPanel = styled.div`
  padding: 16px;
  font-size: 14px;
  color: #374151;
  background-color: #f9fafb;
  border-radius: 8px;
`;

const SrLiveOutput = styled.div`
  margin-top: 12px;
  background-color: #1a1a2e;
  border-radius: 8px;
  padding: 10px 16px;
  font-family: 'Fira Code', 'Consolas', monospace;
  font-size: 13px;
  color: #4ade80;
  border: 1px solid #2d2d44;
  min-height: 36px;
  display: flex;
  align-items: center;
`;

export { TabList, TabButton, TabPanel, SrLiveOutput };
