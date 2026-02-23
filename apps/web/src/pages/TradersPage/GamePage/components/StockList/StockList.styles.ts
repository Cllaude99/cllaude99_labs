import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';

const Container = styled.div`
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;

  &::-webkit-scrollbar {
    height: 4px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.palette.grey200};
    border-radius: 2px;
  }
`;

const TabList = styled.div`
  display: flex;
  gap: 4px;
  padding: 8px;
  min-width: max-content;
`;

const Tab = styled.button<{ active: boolean; disabled?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 8px 14px;
  border-radius: 8px;
  border: 1px solid
    ${({ theme, active, disabled }) =>
      disabled
        ? theme.palette.grey150
        : active
          ? theme.palette.blue500
          : theme.palette.grey200};
  background-color: ${({ theme, active, disabled }) =>
    disabled
      ? theme.palette.grey50
      : active
        ? `${theme.palette.blue500}1A`
        : 'transparent'};
  cursor: ${({ disabled }) => (disabled ? 'default' : 'pointer')};
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
  transition: all 0.2s;
  min-width: 64px;

  &:hover {
    border-color: ${({ theme, disabled }) =>
      disabled ? theme.palette.grey150 : theme.palette.blue500};
  }
`;

const AliasCode = styled.span<{ disabled?: boolean }>`
  font-size: 15px;
  font-weight: 700;
  color: ${({ theme, disabled }) =>
    disabled ? theme.palette.grey400 : theme.palette.grey900};
`;

const Category = styled.span`
  font-size: 11px;
  color: ${({ theme }) => theme.palette.grey500};
`;

const Price = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.palette.grey600};
  font-variant-numeric: tabular-nums;
`;

const UnlistedLabel = styled.span`
  font-size: 11px;
  color: ${({ theme }) => theme.palette.grey400};
`;

const ChangeRate = styled.span<{ isPositive: boolean }>`
  font-size: 11px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  color: ${({ theme, isPositive }) =>
    isPositive ? theme.palette.red500 : theme.palette.blue500};
`;

const pulse = keyframes`
  0%, 100% { opacity: 0.4; }
  50% { opacity: 1; }
`;

const SkeletonTab = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 8px 14px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.palette.grey150};
  background-color: ${({ theme }) => theme.palette.grey50};
  min-width: 64px;
`;

const SkeletonText = styled.div<{ width: string }>`
  width: ${({ width }) => width};
  height: 12px;
  background: ${({ theme }) => theme.palette.grey200};
  border-radius: 4px;
  animation: ${pulse} 1.5s ease-in-out infinite;
`;

export { Container, TabList, Tab, AliasCode, Category, Price, UnlistedLabel, ChangeRate, SkeletonTab, SkeletonText };
