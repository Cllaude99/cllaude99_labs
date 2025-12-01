import styled from '@emotion/styled';

const ZIndex = 9999;

const Container = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: ${ZIndex};
`;

export { Container };
