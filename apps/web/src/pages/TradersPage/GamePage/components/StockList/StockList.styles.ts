import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';

const Container = styled.div`
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scroll-snap-type: x mandatory;

  &::-webkit-scrollbar {
    height: 4px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.traders.borderPrimary};
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
        ? theme.traders.borderSecondary
        : active
          ? theme.traders.ctaPrimary
          : theme.traders.borderPrimary};
  background-color: ${({ theme, active, disabled }) =>
    disabled
      ? theme.traders.bgSecondary
      : active
        ? `${theme.traders.ctaPrimary}1A`
        : 'transparent'};
  cursor: ${({ disabled }) => (disabled ? 'default' : 'pointer')};
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
  transition: all 0.2s;
  min-width: 64px;
  scroll-snap-align: start;

  &:hover {
    border-color: ${({ theme, disabled }) =>
      disabled ? theme.traders.borderSecondary : theme.traders.ctaPrimary};
  }
`;

const AliasCode = styled.span<{ disabled?: boolean }>`
  ${({ theme }) => theme.typography.body2Bold};
  font-weight: 700;
  color: ${({ theme, disabled }) =>
    disabled ? theme.traders.textTertiary : theme.traders.textPrimary};
`;

const Category = styled.span`
  ${({ theme }) => theme.typography.caption2};
  color: ${({ theme }) => theme.traders.textSecondary};
`;

const Price = styled.span`
  ${({ theme }) => theme.typography.caption1};
  color: ${({ theme }) => theme.traders.textSecondary};
  font-variant-numeric: tabular-nums;
`;

const UnlistedLabel = styled.span`
  font-size: 11px;
  color: ${({ theme }) => theme.traders.textTertiary};
`;

const ChangeRate = styled.span<{ isPositive: boolean }>`
  font-size: 11px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  color: ${({ theme, isPositive }) =>
    isPositive ? theme.traders.profitPositive : theme.traders.profitNegative};
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
  border: 1px solid ${({ theme }) => theme.traders.borderSecondary};
  background-color: ${({ theme }) => theme.traders.skeletonBg};
  min-width: 64px;
`;

const SkeletonText = styled.div<{ width: string }>`
  width: ${({ width }) => width};
  height: 12px;
  background: ${({ theme }) => theme.traders.skeletonBase};
  border-radius: 4px;
  animation: ${pulse} 1.5s ease-in-out infinite;
`;

export { Container, TabList, Tab, AliasCode, Category, Price, UnlistedLabel, ChangeRate, SkeletonTab, SkeletonText };
