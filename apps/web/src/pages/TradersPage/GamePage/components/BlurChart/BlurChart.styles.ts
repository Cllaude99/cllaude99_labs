import styled from '@emotion/styled';

const BlurChartWrapper = styled.div<{ isUnlocked: boolean }>`
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  background-color: ${({ theme }) => theme.traders.bgSecondary};
  border: 1px solid ${({ theme }) => theme.traders.borderSecondary};

  > div:first-of-type {
    filter: ${({ isUnlocked }) => (isUnlocked ? 'none' : 'blur(8px)')};
    pointer-events: ${({ isUnlocked }) => (isUnlocked ? 'auto' : 'none')};
    transition: filter 0.5s ease;
  }
`;

const BlurOverlay = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  z-index: 10;
`;

const LockIcon = styled.span`
  font-size: 32px;
`;

const LockText = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.traders.textPrimary};
`;

const LockDesc = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.traders.textSecondary};
`;

const YearLabel = styled.div`
  padding: 8px 16px;
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.traders.textSecondary};
`;

const StockTabs = styled.div`
  display: flex;
  gap: 6px;
  padding: 0 16px 8px;
  overflow-x: auto;
`;

const StockTab = styled.button<{ active: boolean }>`
  padding: 6px 12px;
  border-radius: 6px;
  border: 1px solid
    ${({ theme, active }) =>
      active ? theme.traders.ctaSecondaryBorder : theme.traders.borderPrimary};
  background-color: ${({ theme, active }) =>
    active ? `${theme.traders.ctaSecondaryBorder}26` : 'transparent'};
  color: ${({ theme, active }) =>
    active ? theme.traders.ctaSecondaryText : theme.traders.textSecondary};
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s;

  &:hover {
    border-color: ${({ theme }) => theme.traders.ctaSecondaryBorder};
  }
`;

export {
  BlurChartWrapper,
  BlurOverlay,
  LockIcon,
  LockText,
  LockDesc,
  YearLabel,
  StockTabs,
  StockTab,
};
