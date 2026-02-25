import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useMutation } from '@tanstack/react-query';

import { PATH } from '@/constants';

import * as S from './RoomWaitingPage.styles';
import { leaveRoom, startRoom } from '../apis/room';
import { MAX_ROOM_PARTICIPANTS } from '../constants/game';
import { useRoomRealtime } from '../hooks/useRoomRealtime';
import { useGameStore } from '../stores/gameStore';
import { useRoomStore } from '../stores/roomStore';

const RoomWaitingPage = () => {
  const navigate = useNavigate();
  const {
    roomId,
    roomCode,
    participantId,
    isHost,
    participants,
    roomPhase,
    roomStatus,
  } = useRoomStore();
  const resetRoom = useRoomStore((s) => s.reset);
  const { setSession } = useGameStore();
  const [error, setError] = useState<string | null>(null);

  // Realtime 구독
  useRoomRealtime(roomId);

  // 방이 없으면 로비로 리다이렉트
  useEffect(() => {
    if (!roomId || !participantId) {
      navigate(PATH.TRADERS_ROOM, { replace: true });
    }
  }, [roomId, participantId, navigate]);

  // 게임 시작 감지 및 GamePage로 이동
  useEffect(() => {
    if (roomStatus === 'playing' && roomPhase === 'hint') {
      // 내 session_id를 찾아 gameStore에 설정
      const me = participants.find((p) => p.id === participantId);
      if (me?.session_id && !isHost) {
        // 게스트: sessionId 설정 후 GamePage로 이동
        // stocks는 GamePage에서 stockPricesData로부터 복원
        setSession(me.session_id, []);
        navigate(PATH.TRADERS_GAME, { replace: true });
      }
    }
  }, [roomStatus, roomPhase, participants, participantId, isHost, navigate, setSession]);

  const startMutation = useMutation({
    mutationFn: () => startRoom(roomId!, participantId!),
    onSuccess: (data) => {
      // 호스트: game session 설정 후 이동
      const mySession = data.sessions.find(
        (s) => s.participant_id === participantId,
      );
      if (mySession) {
        setSession(mySession.session_id, data.stocks);
      }
      navigate(PATH.TRADERS_GAME, { replace: true });
    },
    onError: (err: Error) => {
      setError(err.message || '게임 시작에 실패했습니다.');
    },
  });

  const leaveMutation = useMutation({
    mutationFn: () => leaveRoom(roomId!, participantId!),
    onSuccess: () => {
      resetRoom();
      navigate(PATH.TRADERS_ROOM, { replace: true });
    },
    onError: () => {
      setError('방 나가기에 실패했습니다.');
    },
  });

  const handleCopyCode = () => {
    if (roomCode) {
      navigator.clipboard.writeText(roomCode).catch(() => {});
    }
  };

  const handleStart = () => {
    setError(null);
    startMutation.mutate();
  };

  const handleLeave = () => {
    leaveMutation.mutate();
  };

  const emptySlots = Math.max(0, MAX_ROOM_PARTICIPANTS - participants.length);

  return (
    <S.Container>
      <S.Header>
        <S.BackButton onClick={handleLeave}>←</S.BackButton>
        <S.HeaderTitle>대기실</S.HeaderTitle>
      </S.Header>

      <S.Content>
        <S.RoomCodeSection>
          <S.RoomCodeLabel>방 코드</S.RoomCodeLabel>
          <S.RoomCodeValue>
            <S.RoomCode>{roomCode}</S.RoomCode>
            <S.CopyButton onClick={handleCopyCode}>복사</S.CopyButton>
          </S.RoomCodeValue>
        </S.RoomCodeSection>

        <S.ParticipantSection>
          <S.SectionTitle>
            참가자 ({participants.length}/{MAX_ROOM_PARTICIPANTS})
          </S.SectionTitle>
          <S.ParticipantList>
            {participants.map((p) => (
              <S.ParticipantItem
                key={p.id}
                isMe={p.id === participantId}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <S.ParticipantNickname>{p.nickname}</S.ParticipantNickname>
                {p.is_host && <S.HostBadge>방장</S.HostBadge>}
                {p.id === participantId && <S.MeBadge>나</S.MeBadge>}
              </S.ParticipantItem>
            ))}
            {Array.from({ length: emptySlots }).map((_, idx) => (
              <S.EmptySlot key={`empty-${idx}`}>대기 중...</S.EmptySlot>
            ))}
          </S.ParticipantList>
        </S.ParticipantSection>

        <S.BottomSection>
          {isHost ? (
            <S.StartButton
              whileTap={{ scale: 0.97 }}
              onClick={handleStart}
              disabled={participants.length < 2 || startMutation.isPending}
            >
              {startMutation.isPending
                ? '시작 중...'
                : participants.length < 2
                  ? '2명 이상 필요합니다'
                  : '게임 시작'}
            </S.StartButton>
          ) : (
            <S.WaitingMessage>
              방장이 게임을 시작할 때까지 대기 중...
            </S.WaitingMessage>
          )}

          {error && <S.ErrorText>{error}</S.ErrorText>}
        </S.BottomSection>
      </S.Content>
    </S.Container>
  );
};

export default RoomWaitingPage;
