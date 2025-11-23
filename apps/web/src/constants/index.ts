/* 페이지 경로 */
const PATH = {
  ROOT: '/',
  TRADERS: '/traders',
  SKETCH: '/sketch',
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
];

export { PATH, PROJECTS };
