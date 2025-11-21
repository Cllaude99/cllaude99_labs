import styled from '@emotion/styled';
import { motion } from 'motion/react';

const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Content = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 40px;
  gap: 6px;
  flex: 1;
`;

const ComingSoonText = styled.h2`
  ${({ theme }) => theme.typography.display2};
  color: ${({ theme }) => theme.palette.grey900};
`;

const Description = styled.p`
  ${({ theme }) => theme.typography.title1};
  color: ${({ theme }) => theme.palette.grey600};
  margin: 0;
  line-height: 1.6;
`;

export { Container, Content, ComingSoonText, Description };
