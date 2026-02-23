import styled from '@emotion/styled';
import { motion } from 'motion/react';

export const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.palette.white};
`;

export const Header = styled.header`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border-bottom: 1px solid ${({ theme }) => theme.palette.grey150};
`;

export const BackButton = styled.button`
  padding: 6px;
  border: none;
  background: transparent;
  color: ${({ theme }) => theme.palette.grey900};
  font-size: 18px;
  cursor: pointer;
`;

export const HeaderTitle = styled.h1`
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.palette.grey900};
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
  color: ${({ theme }) => theme.palette.grey500};
`;

export const RoomCodeValue = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background-color: ${({ theme }) => theme.palette.grey50};
  border-radius: 10px;
  border: 1px solid ${({ theme }) => theme.palette.grey150};
`;

export const RoomCode = styled.span`
  font-size: 28px;
  font-weight: 800;
  color: ${({ theme }) => theme.palette.blue500};
  letter-spacing: 4px;
  font-variant-numeric: tabular-nums;
`;

export const CopyButton = styled.button`
  padding: 4px 8px;
  border: 1px solid ${({ theme }) => theme.palette.grey200};
  border-radius: 6px;
  background: transparent;
  color: ${({ theme }) => theme.palette.grey500};
  font-size: 12px;
  cursor: pointer;

  &:hover {
    border-color: ${({ theme }) => theme.palette.blue500};
    color: ${({ theme }) => theme.palette.blue500};
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
  color: ${({ theme }) => theme.palette.grey900};
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
    isMe ? `${theme.palette.blue500}14` : theme.palette.grey50};
  border-radius: 10px;
  border: 1px solid
    ${({ theme, isMe }) =>
      isMe ? theme.palette.blue100 : theme.palette.grey150};
`;

export const ParticipantNickname = styled.span`
  flex: 1;
  font-size: 15px;
  font-weight: 600;
  color: ${({ theme }) => theme.palette.grey900};
`;

export const HostBadge = styled.span`
  padding: 2px 8px;
  border-radius: 4px;
  background-color: ${({ theme }) => theme.palette.blue500};
  color: ${({ theme }) => theme.palette.white};
  font-size: 11px;
  font-weight: 600;
`;

export const MeBadge = styled.span`
  padding: 2px 8px;
  border-radius: 4px;
  background-color: ${({ theme }) => theme.palette.grey200};
  color: ${({ theme }) => theme.palette.grey600};
  font-size: 11px;
  font-weight: 600;
`;

export const EmptySlot = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 14px;
  border-radius: 10px;
  border: 1px dashed ${({ theme }) => theme.palette.grey200};
  color: ${({ theme }) => theme.palette.grey300};
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
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.palette.blue500},
    ${({ theme }) => theme.palette.blue600}
  );
  color: ${({ theme }) => theme.palette.white};
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
  background-color: ${({ theme }) => theme.palette.grey50};
  color: ${({ theme }) => theme.palette.grey500};
  font-size: 15px;
  font-weight: 600;
`;

export const ErrorText = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.palette.red500};
  text-align: center;
`;
