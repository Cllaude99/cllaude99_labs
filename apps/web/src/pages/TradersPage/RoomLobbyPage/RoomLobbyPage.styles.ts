import styled from '@emotion/styled';
import { motion } from 'motion/react';

export const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.palette.white};
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
  color: ${({ theme }) => theme.palette.grey900};
  text-align: center;
`;

export const Subtitle = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.palette.grey500};
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
  color: ${({ theme }) => theme.palette.grey600};
`;

export const Input = styled.input`
  width: 100%;
  padding: 12px 14px;
  border-radius: 10px;
  border: 1px solid ${({ theme }) => theme.palette.grey200};
  font-size: 15px;
  color: ${({ theme }) => theme.palette.grey900};
  background-color: ${({ theme }) => theme.palette.white};
  outline: none;

  &:focus {
    border-color: ${({ theme }) => theme.palette.blue500};
  }

  &::placeholder {
    color: ${({ theme }) => theme.palette.grey300};
  }
`;

export const Divider = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  color: ${({ theme }) => theme.palette.grey400};
  font-size: 13px;

  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background-color: ${({ theme }) => theme.palette.grey150};
  }
`;

export const CreateButton = styled(motion.button)`
  width: 100%;
  padding: 14px;
  border-radius: 10px;
  border: none;
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.palette.blue500},
    ${({ theme }) => theme.palette.blue600}
  );
  color: ${({ theme }) => theme.palette.white};
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
  border: 1px solid ${({ theme }) => theme.palette.grey200};
  font-size: 15px;
  font-weight: 600;
  color: ${({ theme }) => theme.palette.grey900};
  text-transform: uppercase;
  letter-spacing: 2px;
  text-align: center;
  outline: none;

  &:focus {
    border-color: ${({ theme }) => theme.palette.blue500};
  }

  &::placeholder {
    color: ${({ theme }) => theme.palette.grey300};
    letter-spacing: 0;
    font-weight: 400;
  }
`;

export const JoinButton = styled(motion.button)`
  padding: 12px 20px;
  border-radius: 10px;
  border: 1px solid ${({ theme }) => theme.palette.blue500};
  background: transparent;
  color: ${({ theme }) => theme.palette.blue500};
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;

  &:hover {
    background-color: ${({ theme }) => `${theme.palette.blue500}14`};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const BackLink = styled.button`
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

export const ErrorText = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.palette.red500};
  text-align: center;
`;
