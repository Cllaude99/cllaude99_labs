import styled from '@emotion/styled';

import { mq } from '../../design-system/breakpoints';

const Container = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  text-align: center;

  padding: 16px 16px 20px;

  ${mq.tablet} {
    padding: 20px 20px 24px;
  }

  ${mq.desktop} {
    padding: 24px 20px 28px;
  }
`;

const FooterText = styled.p`
  ${({ theme }) => theme.typography.body2};
  color: ${({ theme }) => theme.palette.grey400};
  opacity: 0.8;
`;

export { Container, FooterText };
