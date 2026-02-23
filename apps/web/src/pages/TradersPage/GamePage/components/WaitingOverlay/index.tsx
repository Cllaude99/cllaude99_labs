import * as S from './WaitingOverlay.styles';
import type { RoomParticipant } from '../../../interfaces/room';


interface WaitingOverlayProps {
  readyCount: number;
  totalCount: number;
  participants: RoomParticipant[];
}

const WaitingOverlay = ({
  readyCount,
  totalCount,
  participants,
}: WaitingOverlayProps) => {
  return (
    <S.Overlay
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <S.Card
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <S.Title>투자 완료 대기 중</S.Title>
        <S.CountText>
          {readyCount}/{totalCount}
        </S.CountText>
        <S.Description>
          모든 플레이어가 투자를 완료할 때까지 기다려주세요.
        </S.Description>

        <S.ParticipantList>
          {participants.map((p) => (
            <S.ParticipantRow key={p.id} isReady={p.is_ready}>
              <S.ParticipantName>{p.nickname}</S.ParticipantName>
              <S.ReadyBadge isReady={p.is_ready}>
                {p.is_ready ? '완료' : '대기'}
              </S.ReadyBadge>
            </S.ParticipantRow>
          ))}
        </S.ParticipantList>
      </S.Card>
    </S.Overlay>
  );
};

export default WaitingOverlay;
