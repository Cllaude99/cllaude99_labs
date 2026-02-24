import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useMutation } from '@tanstack/react-query';

import { PATH } from '@/constants';


import * as S from './RoomLobbyPage.styles';
import { createRoom, joinRoom } from '../apis/room';
import { useRoomStore } from '../stores/roomStore';

const RoomLobbyPage = () => {
  const navigate = useNavigate();
  const { setRoom } = useRoomStore();
  const [nickname, setNickname] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [error, setError] = useState<string | null>(null);

  const createMutation = useMutation({
    mutationFn: () => createRoom(nickname),
    onSuccess: (data) => {
      setRoom({
        roomId: data.room_id,
        roomCode: data.room_code,
        participantId: data.participant_id,
        nickname,
        isHost: true,
      });
      navigate(`${PATH.TRADERS_ROOM}/${data.room_code}`);
    },
    onError: (err: Error) => {
      setError(err.message || '방 생성에 실패했습니다.');
    },
  });

  const joinMutation = useMutation({
    mutationFn: () => joinRoom(roomCode, nickname),
    onSuccess: (data) => {
      setRoom({
        roomId: data.room_id,
        roomCode: data.room_code,
        participantId: data.participant_id,
        nickname,
        isHost: false,
      });
      navigate(`${PATH.TRADERS_ROOM}/${data.room_code}`);
    },
    onError: (err: Error) => {
      setError(err.message || '방 참여에 실패했습니다.');
    },
  });

  const handleCreate = () => {
    setError(null);
    if (!nickname.trim()) {
      setError('닉네임을 입력해주세요.');
      return;
    }
    createMutation.mutate();
  };

  const handleJoin = () => {
    setError(null);
    if (!nickname.trim()) {
      setError('닉네임을 입력해주세요.');
      return;
    }
    if (!roomCode.trim()) {
      setError('방 코드를 입력해주세요.');
      return;
    }
    joinMutation.mutate();
  };

  const isPending = createMutation.isPending || joinMutation.isPending;

  return (
    <S.Container>
      <S.Content
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <S.Title>멀티플레이</S.Title>
        <S.Subtitle>
          친구들과 함께 투자 대결을 시작하세요.
          <br />
          방을 만들거나, 방 코드로 참여할 수 있습니다.
        </S.Subtitle>

        <S.FormSection>
          <S.InputGroup>
            <S.Label>닉네임</S.Label>
            <S.Input
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="닉네임을 입력하세요"
              maxLength={20}
            />
          </S.InputGroup>

          <S.CreateButton
            whileTap={{ scale: 0.97 }}
            onClick={handleCreate}
            disabled={isPending}
          >
            {createMutation.isPending ? '생성 중...' : '방 만들기'}
          </S.CreateButton>

          <S.Divider>또는</S.Divider>

          <S.JoinSection>
            <S.RoomCodeInput
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              placeholder="방 코드"
              maxLength={6}
            />
            <S.JoinButton
              whileTap={{ scale: 0.97 }}
              onClick={handleJoin}
              disabled={isPending}
            >
              {joinMutation.isPending ? '참여 중...' : '참여하기'}
            </S.JoinButton>
          </S.JoinSection>

          {error && <S.ErrorText>{error}</S.ErrorText>}
        </S.FormSection>

        <S.BackLink onClick={() => navigate(PATH.TRADERS)}>
          솔로 모드로 돌아가기
        </S.BackLink>
      </S.Content>
    </S.Container>
  );
};

export default RoomLobbyPage;
