import { PATH } from '@/constants';

import * as S from './A11yPage.styles';

const A11Y_PAGES = [
  {
    path: PATH.A11Y_SEMANTIC,
    badge: 'HTML',
    title: 'div vs 시맨틱 태그 비교',
    description:
      '스크린 리더 시뮬레이터로 div와 시맨틱 태그의 차이를 직접 들어볼 수 있습니다.',
  },
  {
    path: PATH.A11Y_ARIA_ROLE,
    badge: 'ARIA',
    title: 'ARIA role 비교',
    description:
      '탭을 클릭할 때 스크린 리더가 읽는 내용이 실시간으로 표시됩니다.',
  },
  {
    path: PATH.A11Y_KEYBOARD,
    badge: 'Keyboard',
    title: '키보드 내비게이션 체험',
    description:
      '포커스 챌린지 모드로 포커스 표시가 없으면 얼마나 불편한지 직접 체험해보세요.',
  },
  {
    path: PATH.A11Y_ARIA_HIDDEN,
    badge: 'ARIA',
    title: 'aria-hidden 체험',
    description:
      '스크린 리더 모드를 켜면 말풍선으로 불필요하게 읽히는 내용을 확인할 수 있습니다.',
  },
];

const A11yPage = () => {
  return (
    <S.Container>
      <S.Title>접근성(A11y) 체험 페이지</S.Title>
      <S.Subtitle>
        시맨틱 태그, ARIA, 키보드 내비게이션의 차이를 직접 체험해보세요.
        <br />
        각 페이지에서 DevTools 없이도 접근성 차이를 바로 느낄 수 있습니다.
      </S.Subtitle>

      <S.CardGrid>
        {A11Y_PAGES.map(({ path, badge, title, description }) => (
          <S.Card key={path} to={path}>
            <S.Badge>{badge}</S.Badge>
            <S.CardTitle>{title}</S.CardTitle>
            <S.CardDescription>{description}</S.CardDescription>
            <S.CardLink>체험하러 가기 &rarr;</S.CardLink>
          </S.Card>
        ))}
      </S.CardGrid>
    </S.Container>
  );
};

export default A11yPage;
