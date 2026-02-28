import styled from '@emotion/styled';
import { motion } from 'motion/react';

export const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.traders.bgPrimary};
`;

export const Header = styled.header`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border-bottom: 1px solid ${({ theme }) => theme.traders.borderSecondary};
`;

export const BackButton = styled.button`
  padding: 6px;
  border: none;
  background: transparent;
  color: ${({ theme }) => theme.traders.textPrimary};
  font-size: 18px;
  cursor: pointer;
`;

export const HeaderTitle = styled.h1`
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.traders.textPrimary};
`;

export const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 32px 24px;
  gap: 24px;
`;

export const RoomCodeSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`;

export const RoomCodeLabel = styled.span`
  font-size: 13px;
  color: ${({ theme }) => theme.traders.textSecondary};
`;

export const RoomCodeValue = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background-color: ${({ theme }) => theme.traders.bgSecondary};
  border-radius: 10px;
  border: 1px solid ${({ theme }) => theme.traders.borderSecondary};
`;

export const RoomCode = styled.span`
  font-size: 28px;
  font-weight: 800;
  color: ${({ theme }) => theme.traders.ctaPrimary};
  letter-spacing: 4px;
  font-variant-numeric: tabular-nums;
`;

export const CopyButton = styled.button`
  padding: 4px 8px;
  border: 1px solid ${({ theme }) => theme.traders.borderPrimary};
  border-radius: 6px;
  background: transparent;
  color: ${({ theme }) => theme.traders.textSecondary};
  font-size: 12px;
  cursor: pointer;

  &:hover {
    border-color: ${({ theme }) => theme.traders.ctaPrimary};
    color: ${({ theme }) => theme.traders.ctaPrimary};
  }
`;

export const ParticipantSection = styled.div`
  width: 100%;
  max-width: 360px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const SectionTitle = styled.h3`
  font-size: 15px;
  font-weight: 700;
  color: ${({ theme }) => theme.traders.textPrimary};
`;

export const ParticipantList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const ParticipantItem = styled(motion.div)<{ isMe?: boolean }>`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  background-color: ${({ theme, isMe }) =>
    isMe ? `${theme.traders.ctaPrimary}14` : theme.traders.bgSecondary};
  border-radius: 10px;
  border: 1px solid
    ${({ theme, isMe }) =>
      isMe ? theme.traders.ctaPrimaryLight : theme.traders.borderSecondary};
`;

export const ParticipantNickname = styled.span`
  flex: 1;
  font-size: 15px;
  font-weight: 600;
  color: ${({ theme }) => theme.traders.textPrimary};
`;

export const HostBadge = styled.span`
  padding: 2px 8px;
  border-radius: 4px;
  background-color: ${({ theme }) => theme.traders.ctaPrimary};
  color: ${({ theme }) => theme.traders.textInverse};
  font-size: 11px;
  font-weight: 600;
`;

export const MeBadge = styled.span`
  padding: 2px 8px;
  border-radius: 4px;
  background-color: ${({ theme }) => theme.traders.borderPrimary};
  color: ${({ theme }) => theme.traders.textSecondary};
  font-size: 11px;
  font-weight: 600;
`;

export const EmptySlot = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 14px;
  border-radius: 10px;
  border: 1px dashed ${({ theme }) => theme.traders.borderPrimary};
  color: ${({ theme }) => theme.traders.textTertiary};
  font-size: 13px;
`;

export const BottomSection = styled.div`
  width: 100%;
  max-width: 360px;
  padding: 16px 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const StartButton = styled(motion.button)`
  width: 100%;
  padding: 16px;
  border-radius: 12px;
  border: none;
  background-color: ${({ theme }) => theme.traders.ctaPrimary};
  color: ${({ theme }) => theme.traders.textInverse};
  font-size: 17px;
  font-weight: 700;
  cursor: pointer;

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

export const WaitingMessage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  border-radius: 12px;
  background-color: ${({ theme }) => theme.traders.bgSecondary};
  color: ${({ theme }) => theme.traders.textSecondary};
  font-size: 15px;
  font-weight: 600;
`;

export const ErrorText = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.traders.statusError};
  text-align: center;
`;
