import { useCallback, useRef, useState } from 'react';

import { PATH } from '@/constants';

import * as S from './KeyboardPage.styles';
import * as Shared from '../shared/A11yShared.styles';

const CHALLENGE_BUTTONS = ['좋아요', '댓글', '공유하기', '저장', '신고'];
const TARGET_BUTTON = '공유하기';

const KeyboardPage = () => {
  const [keyboardLog, setKeyboardLog] = useState('Tab 키를 눌러 이동해보세요.');
  const [divClickCount, setDivClickCount] = useState(0);
  const [buttonClickCount, setButtonClickCount] = useState(0);

  const [focusVisible, setFocusVisible] = useState(false);
  const [challengeState, setChallengeState] = useState<
    'idle' | 'playing' | 'success' | 'done'
  >('idle');
  const [noFocusTime, setNoFocusTime] = useState<number | null>(null);
  const [withFocusTime, setWithFocusTime] = useState<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const challengeButtonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const startChallenge = useCallback(() => {
    setChallengeState('playing');
    setFocusVisible(false);
    setNoFocusTime(null);
    setWithFocusTime(null);
    startTimeRef.current = Date.now();
    // 첫 번째 챌린지 버튼으로 포커스 이동
    requestAnimationFrame(() => {
      challengeButtonRefs.current[0]?.focus();
    });
  }, []);

  const handleChallengeKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>, label: string) => {
      if (challengeState !== 'playing' && challengeState !== 'success') return;
      if (e.key !== 'Enter' && e.key !== ' ') return;

      e.preventDefault();

      if (label !== TARGET_BUTTON) return;

      const elapsed = ((Date.now() - startTimeRef.current) / 1000).toFixed(1);

      if (challengeState === 'playing') {
        setNoFocusTime(Number(elapsed));
        setChallengeState('success');
        setFocusVisible(true);
        startTimeRef.current = Date.now();
        // 2라운드: 첫 번째 버튼으로 포커스 리셋
        requestAnimationFrame(() => {
          challengeButtonRefs.current[0]?.focus();
        });
      } else if (challengeState === 'success') {
        setWithFocusTime(Number(elapsed));
        setChallengeState('done');
      }
    },
    [challengeState],
  );

  return (
    <Shared.Container>
      <Shared.BackLink to={PATH.A11Y}>
        &larr; 접근성 체험 목록
      </Shared.BackLink>

      <Shared.Title>키보드 내비게이션 체험</Shared.Title>
      <Shared.Description>
        Tab 키로 이동하고, Enter 또는 Space로 클릭해보세요. div 버튼과 button
        태그의 차이를 직접 느껴볼 수 있습니다.
      </Shared.Description>

      <Shared.ComparisonGrid>
        <Shared.ComparisonCard variant="bad">
          <Shared.CardLabel variant="bad">
            div 버튼 (Tab 이동 불가)
          </Shared.CardLabel>

          <Shared.DivButton
            onClick={() => {
              setDivClickCount((prev) => prev + 1);
              setKeyboardLog('div 버튼: 마우스 클릭만 가능합니다.');
            }}
          >
            좋아요 ({divClickCount})
          </Shared.DivButton>
        </Shared.ComparisonCard>

        <Shared.ComparisonCard variant="good">
          <Shared.CardLabel variant="good">
            button 태그 (Tab + Enter 가능)
          </Shared.CardLabel>

          <Shared.RealButton
            type="button"
            onClick={() => {
              setButtonClickCount((prev) => prev + 1);
              setKeyboardLog(
                'button 태그: Tab으로 포커스 → Enter/Space로 클릭!',
              );
            }}
          >
            좋아요 ({buttonClickCount})
          </Shared.RealButton>
        </Shared.ComparisonCard>
      </Shared.ComparisonGrid>

      <S.ActionLog aria-live="polite">{keyboardLog}</S.ActionLog>

      <Shared.Hint>
        Tab 키를 눌러보세요. div 버튼은 포커스가 건너뛰어지지만, button 태그는
        포커스가 잡히고 파란색 외곽선이 표시됩니다. 포커스된 상태에서 Enter 또는
        Space를 누르면 클릭됩니다.
      </Shared.Hint>

      {/* 포커스 챌린지 섹션 */}
      <S.ChallengeSection>
        <S.ChallengeTitle>포커스 챌린지</S.ChallengeTitle>
        <S.ChallengeGuide>
          포커스 표시(outline)가 없으면 키보드 사용자는 현재 어디에 있는지 알 수
          없어요. 아래 챌린지에서 직접 체험해보세요.
        </S.ChallengeGuide>
        <S.ChallengeSteps>
          <li>
            &quot;챌린지 시작&quot;을 누르면 <strong>포커스 표시 OFF</strong>{' '}
            상태로 시작돼요.
          </li>
          <li>
            Tab 키만으로 &quot;{TARGET_BUTTON}&quot; 버튼을 찾아{' '}
            <strong>Enter</strong>를 누르세요. (마우스 사용 불가)
          </li>
          <li>
            성공하면 <strong>포커스 표시 ON</strong> 상태에서 한 번 더 시도하고,
            걸린 시간을 비교해보세요.
          </li>
        </S.ChallengeSteps>
        <S.ChallengeDescription>
          {challengeState === 'idle' &&
            `준비되셨나요? "챌린지 시작" 버튼을 눌러주세요!`}
          {challengeState === 'playing' &&
            `⏱ 포커스 표시 없이 진행 중... Tab으로 "${TARGET_BUTTON}" 버튼을 찾아 Enter를 누르세요!`}
          {challengeState === 'success' &&
            `✅ 포커스 없이 ${noFocusTime}초 걸렸어요! 이번에는 포커스 표시가 있는 상태에서 다시 "${TARGET_BUTTON}"을 찾아보세요.`}
          {challengeState === 'done' && (
            <>
              포커스 없이: <strong>{noFocusTime}초</strong> / 포커스 있으면:{' '}
              <strong>{withFocusTime}초</strong>
              {noFocusTime !== null &&
                withFocusTime !== null &&
                noFocusTime > withFocusTime && (
                  <span>
                    {' '}
                    — 포커스 표시가 있으면{' '}
                    {(noFocusTime - withFocusTime).toFixed(1)}초 더 빨라요!
                  </span>
                )}
            </>
          )}
        </S.ChallengeDescription>

        <S.ChallengeButtonRow hideFocus={!focusVisible}>
          {CHALLENGE_BUTTONS.map((label, index) => (
            <S.ChallengeButton
              key={label}
              ref={(el) => {
                challengeButtonRefs.current[index] = el;
              }}
              type="button"
              onKeyDown={(e) => handleChallengeKeyDown(e, label)}
              onClick={(e) => e.preventDefault()}
            >
              {label}
            </S.ChallengeButton>
          ))}
        </S.ChallengeButtonRow>

        <S.ChallengeControls>
          {(challengeState === 'idle' || challengeState === 'done') && (
            <S.StartButton type="button" onClick={startChallenge}>
              {challengeState === 'done' ? '다시 도전하기' : '챌린지 시작'}
            </S.StartButton>
          )}
          <S.FocusToggle>
            포커스 표시:{' '}
            <strong>{focusVisible ? 'ON' : 'OFF'}</strong>
          </S.FocusToggle>
        </S.ChallengeControls>
      </S.ChallengeSection>
    </Shared.Container>
  );
};

export default KeyboardPage;
