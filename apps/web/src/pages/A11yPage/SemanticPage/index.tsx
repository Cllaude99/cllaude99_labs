import { PATH } from '@/constants';

import * as S from './SemanticPage.styles';
import * as Shared from '../shared/A11yShared.styles';
import ScreenReaderSimulator from '../shared/ScreenReaderSimulator';

const BAD_SR_LINES = [
  'generic',
  '  generic',
  '  generic',
  '  generic',
  'generic, 이메일',
  'generic, 제출하기',
];

const GOOD_SR_LINES = [
  'navigation, 예시 내비게이션',
  '  link, 홈',
  '  link, 소개',
  '  link, 연락처',
  '이메일, 텍스트 입력란',
  '제출하기, 버튼',
];

const SemanticPage = () => {
  return (
    <Shared.Container>
      <Shared.BackLink to={PATH.A11Y}>
        &larr; 접근성 체험 목록
      </Shared.BackLink>

      <Shared.Title>div vs 시맨틱 태그 비교</Shared.Title>
      <Shared.Description>
        화면에서는 동일하게 보이지만, 접근성 트리에서는 완전히 다르게 해석됩니다.
        아래 &quot;재생&quot; 버튼을 눌러 스크린 리더가 각각을 어떻게 읽는지
        비교해보세요.
      </Shared.Description>

      <Shared.ComparisonGrid>
        <Shared.ComparisonCard variant="bad">
          <Shared.CardLabel variant="bad">div만 사용</Shared.CardLabel>

          <S.DivNavList>
            <S.DivNavItem>홈</S.DivNavItem>
            <S.DivNavItem>소개</S.DivNavItem>
            <S.DivNavItem>연락처</S.DivNavItem>
          </S.DivNavList>

          <S.FormGroup>
            <S.DivLabel>이메일</S.DivLabel>
            <S.DivInput>example@email.com</S.DivInput>
          </S.FormGroup>

          <div style={{ marginTop: 12 }}>
            <Shared.DivButton>제출하기</Shared.DivButton>
          </div>

          <ScreenReaderSimulator lines={BAD_SR_LINES} />
        </Shared.ComparisonCard>

        <Shared.ComparisonCard variant="good">
          <Shared.CardLabel variant="good">시맨틱 태그 사용</Shared.CardLabel>

          <nav aria-label="예시 내비게이션">
            <S.NavList>
              <li>
                <S.RealNavItem href="#home">홈</S.RealNavItem>
              </li>
              <li>
                <S.RealNavItem href="#about">소개</S.RealNavItem>
              </li>
              <li>
                <S.RealNavItem href="#contact">연락처</S.RealNavItem>
              </li>
            </S.NavList>
          </nav>

          <S.FormGroup>
            <S.RealLabel htmlFor="demo-email">이메일</S.RealLabel>
            <S.RealInput
              id="demo-email"
              type="email"
              placeholder="example@email.com"
            />
          </S.FormGroup>

          <div style={{ marginTop: 12 }}>
            <Shared.RealButton type="button">제출하기</Shared.RealButton>
          </div>

          <ScreenReaderSimulator lines={GOOD_SR_LINES} />
        </Shared.ComparisonCard>
      </Shared.ComparisonGrid>

      <Shared.Hint>
        💡 label 클릭 체험: 왼쪽의 &quot;이메일&quot; 텍스트를 클릭해보세요 →
        아무 일도 일어나지 않아요. 오른쪽의 &quot;이메일&quot; label을 클릭하면 →
        input에 포커스가 이동합니다. 이것이 label과 input 연결의 차이예요.
      </Shared.Hint>

      <Shared.VerificationSection>
        <Shared.VerificationTitle>
          스크린 리더 시뮬레이터로 확인하기
        </Shared.VerificationTitle>
        <ol>
          <Shared.VerificationStep>
            각 카드 하단의 &quot;재생&quot; 버튼을 클릭하세요
          </Shared.VerificationStep>
          <Shared.VerificationStep>
            왼쪽(div)은 &quot;generic&quot;만 반복 — 어떤 요소인지 알 수 없어요
          </Shared.VerificationStep>
          <Shared.VerificationStep>
            오른쪽(시맨틱 태그)은 &quot;navigation&quot;, &quot;link, 홈&quot;
            처럼 의미 있는 안내가 출력돼요
          </Shared.VerificationStep>
          <Shared.VerificationStep>
            왼쪽 &quot;이메일&quot; 텍스트를 클릭하면 아무 반응 없음 / 오른쪽
            &quot;이메일&quot; label을 클릭하면 input에 포커스 이동
          </Shared.VerificationStep>
          <Shared.VerificationStep>
            추가로 Chrome DevTools &gt; Elements &gt; Accessibility 탭에서 각
            요소의 role 차이를 확인할 수 있어요
          </Shared.VerificationStep>
        </ol>
      </Shared.VerificationSection>
    </Shared.Container>
  );
};

export default SemanticPage;
