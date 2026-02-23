import styled from '@emotion/styled';
import { motion } from 'motion/react';

export const Container = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px 0;
`;

export const Header = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
`;

export const Title = styled.h3`
  font-size: 20px;
  font-weight: 800;
  color: ${({ theme }) => theme.palette.grey900};
`;

export const YearLabel = styled.span`
  font-size: 14px;
  color: ${({ theme }) => theme.palette.grey500};
`;

export const RankingTable = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid ${({ theme }) => theme.palette.grey150};
  border-radius: 10px;
  overflow: hidden;
`;

export const RankingHeader = styled.div`
  display: grid;
  grid-template-columns: 40px 1fr 100px 80px;
  gap: 4px;
  padding: 10px 12px;
  background-color: ${({ theme }) => theme.palette.grey50};
  border-bottom: 1px solid ${({ theme }) => theme.palette.grey150};
`;

export const HeaderCell = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.palette.grey500};
  text-align: right;

  &:first-of-type,
  &:nth-of-type(2) {
    text-align: left;
  }
`;

export const RankingRow = styled(motion.div)<{
  isMe?: boolean;
  isTop3?: boolean;
}>`
  display: grid;
  grid-template-columns: 40px 1fr 100px 80px;
  gap: 4px;
  padding: 10px 12px;
  background-color: ${({ theme, isMe }) =>
    isMe ? `${theme.palette.blue500}14` : 'transparent'};
  border-bottom: 1px solid ${({ theme }) => theme.palette.grey50};

  &:last-of-type {
    border-bottom: none;
  }
`;

export const RankCell = styled.span<{ isTop3?: boolean }>`
  font-size: 15px;
  font-weight: 700;
  color: ${({ theme, isTop3 }) =>
    isTop3 ? theme.palette.blue500 : theme.palette.grey500};
`;

export const NicknameCell = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.palette.grey900};
`;

export const AssetCell = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.palette.grey900};
  text-align: right;
  font-variant-numeric: tabular-nums;
`;

export const ReturnCell = styled.span<{ isProfit: boolean }>`
  font-size: 14px;
  font-weight: 700;
  color: ${({ theme, isProfit }) =>
    isProfit ? theme.palette.blue500 : theme.palette.red500};
  text-align: right;
  font-variant-numeric: tabular-nums;
`;

export const NextButton = styled(motion.button)`
  width: 100%;
  padding: 16px;
  border-radius: 12px;
  border: none;
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.palette.blue500},
    ${({ theme }) => theme.palette.blue600}
  );
  color: ${({ theme }) => theme.palette.white};
  font-size: 17px;
  font-weight: 700;
  cursor: pointer;
  margin-top: 8px;

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

export const WaitingText = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  border-radius: 12px;
  background-color: ${({ theme }) => theme.palette.grey50};
  color: ${({ theme }) => theme.palette.grey500};
  font-size: 15px;
  font-weight: 600;
`;
