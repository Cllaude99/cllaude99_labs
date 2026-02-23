import styled from '@emotion/styled';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px;
`;

const Title = styled.h2`
  font-size: 22px;
  font-weight: 700;
  color: ${({ theme }) => theme.palette.grey900};
  text-align: center;
  margin-bottom: 8px;
`;

const StockCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background-color: ${({ theme }) => theme.palette.grey50};
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.palette.grey150};
  perspective: 1000px;
`;

const AliasSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const AliasCode = styled.span`
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.palette.grey500};
`;

const Category = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.palette.grey300};
`;

const Arrow = styled.span`
  font-size: 20px;
  color: ${({ theme }) => theme.palette.blue500};
`;

const RealNameSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
`;

const RealName = styled.span`
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.palette.grey900};
`;

export {
  Container,
  Title,
  StockCard,
  AliasSection,
  AliasCode,
  Category,
  Arrow,
  RealNameSection,
  RealName,
};
