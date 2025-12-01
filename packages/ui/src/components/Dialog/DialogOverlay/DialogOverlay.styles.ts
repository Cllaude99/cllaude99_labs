import styled from '@emotion/styled';

const ZIndex = 9998;

const DimmedContainer = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: ${ZIndex};
`;

export { DimmedContainer };
