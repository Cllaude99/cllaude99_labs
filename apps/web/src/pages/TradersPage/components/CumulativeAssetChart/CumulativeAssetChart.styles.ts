import styled from '@emotion/styled';

const ChartContainer = styled.div`
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.traders.borderSecondary};
`;

export { ChartContainer };
