import styled from '@emotion/styled';
import { motion } from 'motion/react';

export const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.traders.bgPrimary};
`;

export const Content = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 24px;
  gap: 24px;
  flex: 1;
`;

export const Title = styled.h1`
  font-size: 28px;
  font-weight: 800;
  color: ${({ theme }) => theme.traders.textPrimary};
  text-align: center;
`;

export const Subtitle = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.traders.textSecondary};
  text-align: center;
  line-height: 1.6;
`;

export const FormSection = styled.div`
  width: 100%;
  max-width: 320px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const Label = styled.label`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.traders.textSecondary};
`;

export const Input = styled.input`
  width: 100%;
  padding: 12px 14px;
  border-radius: 10px;
  border: 1px solid ${({ theme }) => theme.traders.borderPrimary};
  font-size: 15px;
  color: ${({ theme }) => theme.traders.textPrimary};
  background-color: ${({ theme }) => theme.traders.bgPrimary};
  outline: none;

  &:focus {
    border-color: ${({ theme }) => theme.traders.ctaPrimary};
  }

  &::placeholder {
    color: ${({ theme }) => theme.traders.textTertiary};
  }
`;

export const Divider = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  color: ${({ theme }) => theme.traders.textTertiary};
  font-size: 13px;

  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background-color: ${({ theme }) => theme.traders.borderSecondary};
  }
`;

export const CreateButton = styled(motion.button)`
  width: 100%;
  padding: 14px;
  border-radius: 10px;
  border: none;
  background-color: ${({ theme }) => theme.traders.ctaPrimary};
  color: ${({ theme }) => theme.traders.textInverse};
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const JoinSection = styled.div`
  display: flex;
  gap: 8px;
`;

export const RoomCodeInput = styled.input`
  flex: 1;
  padding: 12px 14px;
  border-radius: 10px;
  border: 1px solid ${({ theme }) => theme.traders.borderPrimary};
  font-size: 15px;
  font-weight: 600;
  color: ${({ theme }) => theme.traders.textPrimary};
  text-transform: uppercase;
  letter-spacing: 2px;
  text-align: center;
  outline: none;

  &:focus {
    border-color: ${({ theme }) => theme.traders.ctaPrimary};
  }

  &::placeholder {
    color: ${({ theme }) => theme.traders.textTertiary};
    letter-spacing: 0;
    font-weight: 400;
  }
`;

export const JoinButton = styled(motion.button)`
  padding: 12px 20px;
  border-radius: 10px;
  border: 1px solid ${({ theme }) => theme.traders.ctaSecondaryBorder};
  background: transparent;
  color: ${({ theme }) => theme.traders.ctaSecondaryText};
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;

  &:hover {
    background-color: ${({ theme }) => `${theme.traders.ctaPrimary}14`};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const BackLink = styled.button`
  font-size: 14px;
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

export const ErrorText = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.traders.statusError};
  text-align: center;
`;
