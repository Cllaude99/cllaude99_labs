import { useCallback, useRef, useState } from 'react';

import { PATH } from '@/constants';

import * as S from './AriaRolePage.styles';
import * as Shared from '../shared/A11yShared.styles';

const TAB_ITEMS = ['프로필', '설정', '알림'];
const TAB_CONTENTS = [
  '프로필 설정을 변경할 수 있습니다.',
  '앱 설정을 관리합니다.',
  '알림 환경설정을 조정합니다.',
];

const speak = (text: string) => {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'ko-KR';
  utterance.rate = 1.2;
  window.speechSynthesis.speak(utterance);
};

const AriaRolePage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [badActiveTab, setBadActiveTab] = useState(0);
  const [badSrOutput, setBadSrOutput] = useState('탭을 클릭해보세요');
  const [goodSrOutput, setGoodSrOutput] = useState('탭을 클릭해보세요');
  const goodTabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const handleBadTabClick = (index: number) => {
    setBadActiveTab(index);
    const output = `${TAB_ITEMS[index]}, 버튼`;
    setBadSrOutput(`"${output}"`);
    speak(output);
  };

  const handleGoodTabClick = (index: number) => {
    setActiveTab(index);
    const output = `${TAB_ITEMS[index]}, 탭, ${TAB_ITEMS.length}개 중 ${index + 1}번째, 선택됨`;
    setGoodSrOutput(`"${output}"`);
    speak(output);
  };

  const handleGoodTabKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>, currentIndex: number) => {
      let nextIndex = currentIndex;

      if (e.key === 'ArrowRight') {
        nextIndex = (currentIndex + 1) % TAB_ITEMS.length;
      } else if (e.key === 'ArrowLeft') {
        nextIndex =
          (currentIndex - 1 + TAB_ITEMS.length) % TAB_ITEMS.length;
      } else {
        return;
      }

      e.preventDefault();
      setActiveTab(nextIndex);
      const output = `${TAB_ITEMS[nextIndex]}, 탭, ${TAB_ITEMS.length}개 중 ${nextIndex + 1}번째, 선택됨`;
      setGoodSrOutput(`"${output}"`);
      speak(output);
      goodTabRefs.current[nextIndex]?.focus();
    },
    [],
  );

  return (
    <Shared.Container>
      <Shared.BackLink to={PATH.A11Y}>
        &larr; 접근성 체험 목록
      </Shared.BackLink>

      <Shared.Title>ARIA role 비교</Shared.Title>
      <Shared.Description>
        탭을 클릭하면 스크린 리더가 읽는 내용이 실시간으로 표시됩니다. 올바른
        role 쪽에서는 화살표 키(←→)로도 탭을 이동할 수 있어요.
      </Shared.Description>

      <Shared.ComparisonGrid>
        <Shared.ComparisonCard variant="bad">
          <Shared.CardLabel variant="bad">잘못된 role</Shared.CardLabel>

          {/* eslint-disable-next-line jsx-a11y/role-has-required-aria-props */}
          <S.TabList role="tablist">
            {TAB_ITEMS.map((item, index) => (
              <S.TabButton
                key={item}
                role="tab_button" // eslint-disable-line jsx-a11y/aria-role -- 잘못된 role을 의도적으로 데모
                isActive={badActiveTab === index}
                onClick={() => handleBadTabClick(index)}
              >
                {item}
              </S.TabButton>
            ))}
          </S.TabList>
          <S.TabPanel>{TAB_CONTENTS[badActiveTab]}</S.TabPanel>
          <S.SrLiveOutput aria-live="polite">
            <span aria-hidden="true">🔊 </span>
            {badSrOutput}
          </S.SrLiveOutput>
        </Shared.ComparisonCard>

        <Shared.ComparisonCard variant="good">
          <Shared.CardLabel variant="good">올바른 role</Shared.CardLabel>

          <S.TabList role="tablist">
            {TAB_ITEMS.map((item, index) => (
              <S.TabButton
                key={item}
                ref={(el) => {
                  goodTabRefs.current[index] = el;
                }}
                role="tab"
                aria-selected={activeTab === index}
                tabIndex={activeTab === index ? 0 : -1}
                isActive={activeTab === index}
                onClick={() => handleGoodTabClick(index)}
                onKeyDown={(e) => handleGoodTabKeyDown(e, index)}
              >
                {item}
              </S.TabButton>
            ))}
          </S.TabList>
          <S.TabPanel role="tabpanel">{TAB_CONTENTS[activeTab]}</S.TabPanel>
          <S.SrLiveOutput aria-live="polite">
            <span aria-hidden="true">🔊 </span>
            {goodSrOutput}
          </S.SrLiveOutput>
        </Shared.ComparisonCard>
      </Shared.ComparisonGrid>

      <Shared.Hint>
        오른쪽(올바른 role)에서 탭에 포커스를 두고 ← → 화살표 키를 눌러보세요.
        탭이 이동하면서 SR 출력도 갱신됩니다. 왼쪽에서는 화살표 키가 작동하지
        않아요 — 이것이 올바른 ARIA 패턴의 차이예요.
      </Shared.Hint>

      <Shared.VerificationSection>
        <Shared.VerificationTitle>
          실시간 SR 출력으로 확인하기
        </Shared.VerificationTitle>
        <ol>
          <Shared.VerificationStep>
            왼쪽(잘못된 role)에서 &quot;프로필&quot; 탭을 클릭 → SR 출력:
            &quot;프로필, 버튼&quot; (탭 정보 없음, 위치 모름)
          </Shared.VerificationStep>
          <Shared.VerificationStep>
            오른쪽(올바른 role)에서 &quot;프로필&quot; 탭을 클릭 → SR 출력:
            &quot;프로필, 탭, 3개 중 1번째, 선택됨&quot;
          </Shared.VerificationStep>
          <Shared.VerificationStep>
            오른쪽에서 Tab으로 포커스 → ← → 화살표 키로 탭 이동 가능
          </Shared.VerificationStep>
          <Shared.VerificationStep>
            왼쪽에서는 화살표 키가 반응 없음 — ARIA 패턴 미적용
          </Shared.VerificationStep>
        </ol>
      </Shared.VerificationSection>
    </Shared.Container>
  );
};

export default AriaRolePage;
