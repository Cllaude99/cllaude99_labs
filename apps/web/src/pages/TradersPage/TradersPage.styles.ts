import styled from '@emotion/styled';
import { motion } from 'motion/react';

const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.traders.bgPrimary};
`;

const Content = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 48px 24px 60px;
  gap: 24px;
  flex: 1;
`;

const Title = styled.h1`
  ${({ theme }) => theme.typography.display3};
  color: ${({ theme }) => theme.traders.textPrimary};
  text-align: center;
`;

const Subtitle = styled.p`
  ${({ theme }) => theme.typography.body1};
  color: ${({ theme }) => theme.traders.textSecondary};
  text-align: center;
  line-height: 1.6;
  max-width: 360px;
`;

const NicknameInput = styled.input`
  width: 100%;
  max-width: 320px;
  padding: 14px 16px;
  border-radius: 14px;
  border: 1px solid ${({ theme }) => theme.traders.borderPrimary};
  ${({ theme }) => theme.typography.body2};
  color: ${({ theme }) => theme.traders.textPrimary};
  outline: none;
  text-align: center;
  background-color: ${({ theme }) => theme.traders.bgPrimary};

  &::placeholder {
    color: ${({ theme }) => theme.traders.textTertiary};
  }

  &:focus {
    border-color: ${({ theme }) => theme.traders.ctaPrimary};
  }
`;

const StartButton = styled(motion.button)`
  width: 100%;
  max-width: 320px;
  padding: 16px;
  border-radius: 14px;
  border: none;
  background-color: ${({ theme }) => theme.traders.ctaPrimary};
  color: ${({ theme }) => theme.traders.textInverse};
  ${({ theme }) => theme.typography.title1};
  cursor: pointer;

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
  border-radius: 14px;
  border: 1px solid ${({ theme }) => theme.traders.ctaSecondaryBorder};
  background: ${({ theme }) => theme.traders.ctaSecondaryBg};
  color: ${({ theme }) => theme.traders.ctaSecondaryText};
  ${({ theme }) => theme.typography.title2};
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => `${theme.traders.ctaPrimary}14`};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const RankingLink = styled.button`
  ${({ theme }) => theme.typography.body3};
  color: ${({ theme }) => theme.traders.textSecondary};
  background: none;
  border: none;
  cursor: pointer;
  text-decoration: underline;
  margin-top: 8px;

  &:hover {
    color: ${({ theme }) => theme.traders.textPrimary};
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
  background-color: ${({ theme }) => theme.traders.bgSecondary};
  border-radius: 14px;
  border: 1px solid ${({ theme }) => theme.traders.borderSecondary};
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px ${({ theme }) => `${theme.traders.textPrimary}0a`};
  }
`;

const FeatureTitle = styled.span`
  ${({ theme }) => theme.typography.label2Bold};
  color: ${({ theme }) => theme.traders.textPrimary};
  display: block;
  margin-bottom: 4px;
`;

const FeatureDesc = styled.span`
  ${({ theme }) => theme.typography.caption2};
  color: ${({ theme }) => theme.traders.textTertiary};
  line-height: 1.4;
`;

const MultiplayButton = styled(motion.button)`
  width: 100%;
  max-width: 320px;
  padding: 14px;
  border-radius: 14px;
  border: 1px solid ${({ theme }) => theme.traders.borderPrimary};
  background: transparent;
  color: ${({ theme }) => theme.traders.textSecondary};
  ${({ theme }) => theme.typography.title2};
  cursor: pointer;

  &:hover {
    border-color: ${({ theme }) => theme.traders.ctaPrimary};
    color: ${({ theme }) => theme.traders.ctaPrimary};
  }
`;

const ErrorText = styled.p`
  ${({ theme }) => theme.typography.body3};
  color: ${({ theme }) => theme.traders.statusError};
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
