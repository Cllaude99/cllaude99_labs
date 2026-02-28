/* Traders 하위 라우트 */
const TRADERS_ROUTES = {
  GAME: 'game',
  GAME_COMPLETE: 'game/complete',
  RANKING: 'ranking',
  ROOM: 'room',
  ROOM_WAITING: 'room/:roomCode',
} as const;

/* 페이지 경로 (절대 경로) */
const PATH = {
  ROOT: '/',
  /* Traders 하위 라우트 */
  TRADERS: '/traders',
  TRADERS_GAME: `/traders/${TRADERS_ROUTES.GAME}`,
  TRADERS_RANKING: `/traders/${TRADERS_ROUTES.RANKING}`,
  TRADERS_GAME_COMPLETE: `/traders/${TRADERS_ROUTES.GAME_COMPLETE}`,
  TRADERS_ROOM: `/traders/${TRADERS_ROUTES.ROOM}`,
  TRADERS_ROOM_WAITING: `/traders/${TRADERS_ROUTES.ROOM_WAITING}`,

  /* Sketch 하위 라우트 */
  SKETCH: '/sketch',

  /* A11y 하위 라우트 */
  A11Y: '/a11y',
  A11Y_SEMANTIC: '/a11y/semantic',
  A11Y_ARIA_ROLE: '/a11y/aria-role',
  A11Y_KEYBOARD: '/a11y/keyboard',
  A11Y_ARIA_HIDDEN: '/a11y/aria-hidden',
} as const;

/* 사이드 프로젝트 메타 데이터 */
const PROJECTS = [
  {
    id: 0,
    title: 'Sketch',
    description: '실시간 협업이 가능한 캔버스',
    path: PATH.SKETCH,
    techStack: ['React-Konva', 'Liveblocks', 'CRDT', 'rough.js'],
  },
  {
    id: 1,
    title: 'Traders',
    description: '과거로 돌아가 주식 투자를 다시 해보는 실시간 시뮬레이션 게임',
    path: PATH.TRADERS,
    techStack: ['React', 'Supabase', 'Lightweight Charts', 'WebSocket'],
  },
  {
    id: 2,
    title: 'A11y 체험',
    description:
      '시맨틱 태그, ARIA, 키보드 내비게이션의 차이를 직접 체험해보는 접근성 데모',
    path: PATH.A11Y,
    techStack: ['Semantic HTML', 'ARIA', 'Keyboard A11y', 'Web Speech API'],
  },
];

export { PATH, TRADERS_ROUTES, PROJECTS };
