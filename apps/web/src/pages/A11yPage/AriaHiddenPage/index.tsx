import { useState } from 'react';

import { PATH } from '@/constants';

import * as S from './AriaHiddenPage.styles';
import * as Shared from '../components/A11yShared.styles';

const StarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="#f59e0b">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="#16a34a">
    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
  </svg>
);

const WarningIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="#dc2626">
    <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
  </svg>
);

const CartIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="#3182f6">
    <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49A1.003 1.003 0 0020 4H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" />
  </svg>
);

interface IconItem {
  icon: React.ReactNode;
  text: string;
  badSr: string;
  goodSr: string;
}

const ICON_ITEMS: IconItem[] = [
  {
    icon: <CheckIcon />,
    text: '주문 완료',
    badSr: '"이미지, 주문 완료"',
    goodSr: '"주문 완료"',
  },
  {
    icon: <WarningIcon />,
    text: '재고 부족',
    badSr: '"이미지, 재고 부족"',
    goodSr: '"재고 부족"',
  },
  {
    icon: <StarIcon />,
    text: '즐겨찾기에 추가됨',
    badSr: '"이미지, 즐겨찾기에 추가됨"',
    goodSr: '"즐겨찾기에 추가됨"',
  },
  {
    icon: <CartIcon />,
    text: '장바구니에 담김',
    badSr: '"이미지, 장바구니에 담김"',
    goodSr: '"장바구니에 담김"',
  },
];

const AriaHiddenPage = () => {
  const [srMode, setSrMode] = useState(false);

  return (
    <Shared.Container>
      <Shared.BackLink to={PATH.A11Y}>&larr; 접근성 체험 목록</Shared.BackLink>

      <Shared.Title>aria-hidden 체험</Shared.Title>
      <Shared.Description>
        장식용 아이콘에 aria-hidden 속성이 있을 때와 없을 때의 차이입니다.
        스크린 리더가 불필요한 요소를 읽지 않도록 할 수 있습니다.
      </Shared.Description>

      <S.ToggleRow>
        <S.ToggleButton
          type="button"
          isActive={srMode}
          onClick={() => setSrMode((prev) => !prev)}
        >
          🔊 스크린 리더 모드 {srMode ? 'ON' : 'OFF'}
        </S.ToggleButton>
        <S.ToggleHint>
          {srMode
            ? '말풍선으로 스크린 리더가 읽는 내용을 확인하세요'
            : '토글을 켜면 스크린 리더가 읽는 내용이 말풍선으로 표시됩니다'}
        </S.ToggleHint>
      </S.ToggleRow>

      <Shared.ComparisonGrid>
        <Shared.ComparisonCard variant="bad">
          <Shared.CardLabel variant="bad">aria-hidden 없음</Shared.CardLabel>

          {ICON_ITEMS.map(({ icon, text, badSr }) => (
            <S.IconItemWrapper key={text}>
              {srMode && <S.SpeechBubble variant="bad">{badSr}</S.SpeechBubble>}
              <S.IconRow>
                <span aria-hidden={false}>{icon}</span>
                {text}
              </S.IconRow>
            </S.IconItemWrapper>
          ))}
        </Shared.ComparisonCard>

        <Shared.ComparisonCard variant="good">
          <Shared.CardLabel variant="good">
            aria-hidden=&quot;true&quot;
          </Shared.CardLabel>

          {ICON_ITEMS.map(({ icon, text, goodSr }) => (
            <S.IconItemWrapper key={text}>
              {srMode && (
                <S.SpeechBubble variant="good">{goodSr}</S.SpeechBubble>
              )}
              <S.IconRow>
                <span aria-hidden>{icon}</span>
                {text}
              </S.IconRow>
            </S.IconItemWrapper>
          ))}
        </Shared.ComparisonCard>
      </Shared.ComparisonGrid>

      <Shared.Hint>
        스크린 리더 모드를 켜면 각 아이콘+텍스트 위에 말풍선이 표시됩니다.
        왼쪽은 &quot;이미지&quot;가 불필요하게 포함되고, 오른쪽은 텍스트만
        깔끔하게 읽혀요.
      </Shared.Hint>

      <Shared.VerificationSection>
        <Shared.VerificationTitle>말풍선으로 확인하기</Shared.VerificationTitle>
        <ol>
          <Shared.VerificationStep>
            상단의 &quot;스크린 리더 모드&quot; 토글을 켜세요
          </Shared.VerificationStep>
          <Shared.VerificationStep>
            왼쪽(aria-hidden 없음): 말풍선에 &quot;이미지&quot;가 포함됨 —
            장식용 아이콘이 불필요하게 읽힘
          </Shared.VerificationStep>
          <Shared.VerificationStep>
            오른쪽(aria-hidden=&quot;true&quot;): 텍스트만 표시됨 — 깔끔한 안내
          </Shared.VerificationStep>
        </ol>
      </Shared.VerificationSection>
    </Shared.Container>
  );
};

export default AriaHiddenPage;
