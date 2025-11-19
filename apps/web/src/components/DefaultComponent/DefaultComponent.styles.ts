import styled from '@emotion/styled';

import { mq } from '@cllaude99/ui';

const Container = styled.div`
  padding: 16px;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.palette.grey50};

  ${mq.tablet} {
    padding: 24px;
  }

  ${mq.desktop} {
    padding: 32px;
  }
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 32px;

  ${mq.tablet} {
    margin-bottom: 48px;
  }

  ${mq.desktop} {
    margin-bottom: 64px;
  }
`;

const Section = styled.section`
  margin-bottom: 24px;

  ${mq.tablet} {
    margin-bottom: 32px;
  }

  ${mq.desktop} {
    margin-bottom: 40px;
  }
`;

const Title = styled.h1`
  ${({ theme }) => theme.typography.title2};
  color: ${({ theme }) => theme.palette.grey800};
  margin-bottom: 16px;

  ${mq.tablet} {
    ${({ theme }) => theme.typography.title1};
    margin-bottom: 24px;
  }

  ${mq.desktop} {
    ${({ theme }) => theme.typography.heading4};
  }
`;

const Description = styled.p`
  ${({ theme }) => theme.typography.body3};
  color: ${({ theme }) => theme.palette.grey600};
  margin-bottom: 24px;

  ${mq.tablet} {
    ${({ theme }) => theme.typography.body2};
    max-width: 80%;
    margin: 0 auto 32px;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 0 auto;
  max-width: 280px;

  ${mq.tablet} {
    flex-direction: row;
    gap: 16px;
    max-width: none;
    justify-content: center;
  }
`;

const Button = styled.a`
  ${({ theme }) => theme.typography.title2};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 24px;
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.2s ease-in-out;
  background-color: ${({ theme }) => theme.palette.blue500};
  color: ${({ theme }) => theme.palette.white};
  border: none;

  &:hover {
    background-color: ${({ theme }) => theme.palette.blue600};
  }

  ${mq.tablet} {
    ${({ theme }) => theme.typography.title1};
    padding: 14px 28px;
  }

  &.secondary {
    background-color: ${({ theme }) => theme.palette.white};
    color: ${({ theme }) => theme.palette.grey800};

    &:hover {
      background-color: ${({ theme }) => theme.palette.grey100};
    }
  }
`;

export {
  Container,
  Header,
  Section,
  Title,
  Description,
  ButtonContainer,
  Button,
};
