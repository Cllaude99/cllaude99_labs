import styled from '@emotion/styled';
import { motion } from 'motion/react';

const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.palette.white};
`;

const Content = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 24px;
  gap: 24px;
  flex: 1;
`;

const Title = styled.h1`
  font-size: 36px;
  font-weight: 800;
  color: ${({ theme }) => theme.palette.grey900};
  text-align: center;
`;

const Subtitle = styled.p`
  font-size: 16px;
  color: ${({ theme }) => theme.palette.grey500};
  text-align: center;
  line-height: 1.6;
  max-width: 360px;
`;

const NicknameInput = styled.input`
  width: 100%;
  max-width: 320px;
  padding: 14px 16px;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.palette.grey200};
  font-size: 15px;
  color: ${({ theme }) => theme.palette.grey900};
  outline: none;
  text-align: center;
  background-color: ${({ theme }) => theme.palette.white};

  &::placeholder {
    color: ${({ theme }) => theme.palette.grey400};
  }

  &:focus {
    border-color: ${({ theme }) => theme.palette.blue500};
  }
`;

const StartButton = styled(motion.button)`
  width: 100%;
  max-width: 320px;
  padding: 16px;
  border-radius: 12px;
  border: none;
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.palette.blue500},
    ${({ theme }) => theme.palette.blue600}
  );
  color: ${({ theme }) => theme.palette.white};
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;
  margin-top: 16px;

  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ResumeButton = styled(motion.button)`
  width: 100%;
  max-width: 320px;
  padding: 14px;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.palette.blue500};
  background: transparent;
  color: ${({ theme }) => theme.palette.blue500};
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => `${theme.palette.blue500}14`};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const RankingLink = styled.button`
  font-size: 14px;
  color: ${({ theme }) => theme.palette.grey500};
  background: none;
  border: none;
  cursor: pointer;
  text-decoration: underline;
  margin-top: 8px;

  &:hover {
    color: ${({ theme }) => theme.palette.grey900};
  }
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  width: 100%;
  max-width: 360px;
  margin-top: 12px;
`;

const FeatureCard = styled.div`
  padding: 16px;
  background-color: ${({ theme }) => theme.palette.grey50};
  border-radius: 10px;
  border: 1px solid ${({ theme }) => theme.palette.grey150};
`;

const FeatureTitle = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.palette.grey900};
  display: block;
  margin-bottom: 4px;
`;

const FeatureDesc = styled.span`
  font-size: 11px;
  color: ${({ theme }) => theme.palette.grey400};
  line-height: 1.4;
`;

const MultiplayButton = styled(motion.button)`
  width: 100%;
  max-width: 320px;
  padding: 14px;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.palette.grey300};
  background: transparent;
  color: ${({ theme }) => theme.palette.grey700};
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    border-color: ${({ theme }) => theme.palette.blue500};
    color: ${({ theme }) => theme.palette.blue500};
  }
`;

const ErrorText = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.palette.red500};
  text-align: center;
`;

export {
  Container,
  Content,
  Title,
  Subtitle,
  NicknameInput,
  StartButton,
  ResumeButton,
  MultiplayButton,
  RankingLink,
  FeatureGrid,
  FeatureCard,
  FeatureTitle,
  FeatureDesc,
  ErrorText,
};
