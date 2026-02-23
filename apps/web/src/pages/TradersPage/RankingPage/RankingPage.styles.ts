import styled from '@emotion/styled';

const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.palette.white};
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border-bottom: 1px solid ${({ theme }) => theme.palette.grey150};
`;

const BackButton = styled.button`
  padding: 6px;
  border: none;
  background: transparent;
  color: ${({ theme }) => theme.palette.grey900};
  font-size: 18px;
  cursor: pointer;
`;

const Title = styled.h1`
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.palette.grey900};
`;

const Content = styled.main`
  flex: 1;
  padding: 16px;
`;

const RankingList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const RankingItem = styled.div<{ isTop3: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  background-color: ${({ theme, isTop3 }) =>
    isTop3 ? `${theme.palette.blue500}14` : theme.palette.grey50};
  border-radius: 10px;
  border: 1px solid
    ${({ theme, isTop3 }) =>
      isTop3 ? theme.palette.blue100 : theme.palette.grey150};
`;

const RankNumber = styled.span<{ isTop3: boolean }>`
  min-width: 28px;
  font-size: ${({ isTop3 }) => (isTop3 ? '18px' : '14px')};
  font-weight: 700;
  color: ${({ theme, isTop3 }) =>
    isTop3 ? theme.palette.blue500 : theme.palette.grey500};
  text-align: center;
`;

const RankInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const Nickname = styled.span`
  font-size: 15px;
  font-weight: 600;
  color: ${({ theme }) => theme.palette.grey900};
`;

const RankDetail = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.palette.grey400};
`;

const RankReturn = styled.span<{ isProfit: boolean }>`
  font-size: 16px;
  font-weight: 700;
  color: ${({ theme, isProfit }) =>
    isProfit ? theme.palette.blue500 : theme.palette.red500};
  font-variant-numeric: tabular-nums;
`;

const LoadMoreTrigger = styled.div`
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.palette.grey400};
  font-size: 13px;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: ${({ theme }) => theme.palette.grey400};
  font-size: 15px;
`;

export {
  Container,
  Header,
  BackButton,
  Title,
  Content,
  RankingList,
  RankingItem,
  RankNumber,
  RankInfo,
  Nickname,
  RankDetail,
  RankReturn,
  LoadMoreTrigger,
  EmptyState,
};
