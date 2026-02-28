import styled from '@emotion/styled';

const Badge = styled.button`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.traders.borderPrimary};
  background-color: ${({ theme }) => `${theme.traders.ctaPrimary}14`};
  color: ${({ theme }) => theme.traders.ctaPrimary};
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  font-variant-numeric: tabular-nums;

  &:hover {
    background-color: ${({ theme }) => `${theme.traders.ctaPrimary}26`};
    border-color: ${({ theme }) => theme.traders.ctaPrimary};
  }
`;

const Drawer = styled.div<{ open: boolean }>`
  position: fixed;
  top: 0;
  right: 0;
  width: 280px;
  max-width: 85vw;
  height: 100vh;
  background-color: ${({ theme }) => theme.traders.surfaceElevated};
  border-left: 1px solid ${({ theme }) => theme.traders.borderSecondary};
  z-index: 200;
  transform: translateX(${({ open }) => (open ? '0' : '100%')});
  transition: transform 0.3s ease;
  display: flex;
  flex-direction: column;
`;

const Overlay = styled.div<{ open: boolean }>`
  position: fixed;
  inset: 0;
  background-color: ${({ theme }) => theme.traders.surfaceOverlay};
  z-index: 199;
  opacity: ${({ open }) => (open ? 1 : 0)};
  pointer-events: ${({ open }) => (open ? 'auto' : 'none')};
  transition: opacity 0.3s ease;
`;

const DrawerHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid ${({ theme }) => theme.traders.borderSecondary};
`;

const DrawerTitle = styled.h3`
  font-size: 16px;
  font-weight: 700;
  color: ${({ theme }) => theme.traders.textPrimary};
`;

const CloseButton = styled.button`
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  border: 1px solid ${({ theme }) => theme.traders.borderPrimary};
  background: transparent;
  color: ${({ theme }) => theme.traders.textSecondary};
  font-size: 16px;
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.traders.bgSecondary};
  }
`;

const MyRankSection = styled.div`
  padding: 12px 16px;
  background-color: ${({ theme }) => `${theme.traders.ctaPrimary}0D`};
  border-bottom: 1px solid ${({ theme }) => theme.traders.borderSecondary};
`;

const MyRankLabel = styled.span`
  font-size: 11px;
  color: ${({ theme }) => theme.traders.textSecondary};
`;

const MyRankValue = styled.div`
  font-size: 20px;
  font-weight: 800;
  color: ${({ theme }) => theme.traders.ctaPrimary};
  font-variant-numeric: tabular-nums;
`;

const MyReturnRate = styled.span<{ isProfit: boolean }>`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme, isProfit }) =>
    isProfit ? theme.traders.profitPositive : theme.traders.profitNegative};
  font-variant-numeric: tabular-nums;
`;

const TotalPlayers = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.traders.textSecondary};
`;

const SectionLabel = styled.div`
  padding: 8px 16px;
  font-size: 11px;
  font-weight: 600;
  color: ${({ theme }) => theme.traders.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const RankList = styled.div`
  flex: 1;
  overflow-y: auto;
`;

const RankItem = styled.div<{ isMe?: boolean }>`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  background-color: ${({ theme, isMe }) =>
    isMe ? `${theme.traders.ctaPrimary}0D` : 'transparent'};
  border-bottom: 1px solid ${({ theme }) => theme.traders.bgTertiary};
`;

const RankPosition = styled.span<{ isTop3?: boolean }>`
  min-width: 24px;
  font-size: 14px;
  font-weight: 700;
  color: ${({ theme, isTop3 }) =>
    isTop3 ? theme.traders.rankHighlight : theme.traders.textSecondary};
  font-variant-numeric: tabular-nums;
`;

const RankInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const RankNickname = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.traders.textPrimary};
`;

const RankYear = styled.span`
  font-size: 11px;
  color: ${({ theme }) => theme.traders.textSecondary};
`;

const RankReturnRate = styled.span<{ isProfit: boolean }>`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme, isProfit }) =>
    isProfit ? theme.traders.profitPositive : theme.traders.profitNegative};
  font-variant-numeric: tabular-nums;
`;

const Separator = styled.div`
  padding: 4px 16px;
  text-align: center;
  font-size: 12px;
  color: ${({ theme }) => theme.traders.textTertiary};
`;

export {
  Badge,
  Drawer,
  Overlay,
  DrawerHeader,
  DrawerTitle,
  CloseButton,
  MyRankSection,
  MyRankLabel,
  MyRankValue,
  MyReturnRate,
  TotalPlayers,
  SectionLabel,
  RankList,
  RankItem,
  RankPosition,
  RankInfo,
  RankNickname,
  RankYear,
  RankReturnRate,
  Separator,
};
