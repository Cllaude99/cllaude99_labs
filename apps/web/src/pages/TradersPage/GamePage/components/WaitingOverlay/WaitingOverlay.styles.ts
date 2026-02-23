import styled from '@emotion/styled';
import { motion } from 'motion/react';

export const Overlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
`;

export const Card = styled(motion.div)`
  width: 90%;
  max-width: 320px;
  padding: 28px 24px;
  background-color: ${({ theme }) => theme.palette.white};
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
`;

export const Title = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.palette.grey900};
`;

export const CountText = styled.span`
  font-size: 32px;
  font-weight: 800;
  color: ${({ theme }) => theme.palette.blue500};
  font-variant-numeric: tabular-nums;
`;

export const Description = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.palette.grey500};
  text-align: center;
`;

export const ParticipantList = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const ParticipantRow = styled.div<{ isReady: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  background-color: ${({ theme, isReady }) =>
    isReady ? `${theme.palette.blue500}14` : theme.palette.grey50};
  border-radius: 8px;
`;

export const ParticipantName = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.palette.grey900};
`;

export const ReadyBadge = styled.span<{ isReady: boolean }>`
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme, isReady }) =>
    isReady ? theme.palette.blue500 : theme.palette.grey400};
`;
