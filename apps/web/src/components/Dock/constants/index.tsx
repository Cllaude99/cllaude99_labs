import {
  BookOpen,
  FolderOpen,
  Home,
  MoveHorizontal,
  Terminal,
} from 'lucide-react';

import { PROJECTS } from '@/constants';

/**
 * Dock 아이템 설정
 */
interface DockItemConfig {
  id: string;
  icon: React.ReactNode;
  label: string;
}

const DOCK_ITEMS: DockItemConfig[] = [
  { id: 'home', icon: <Home />, label: '홈' },
  { id: 'projects', icon: <FolderOpen />, label: '프로젝트' },
  { id: 'blog', icon: <BookOpen />, label: '블로그' },
  { id: 'terminal', icon: <Terminal />, label: '터미널' },
  { id: 'dock-position', icon: <MoveHorizontal />, label: 'Dock 위치 변경' },
];

/**
 * 터미널 명령어 설정
 */
interface CommandHandler {
  description: string;
  handler: (args: string[]) => string;
}

const TERMINAL_COMMANDS: Record<string, CommandHandler> = {
  help: {
    description: '사용 가능한 명령어 목록 표시',
    handler: () => {
      const commands = Object.entries(TERMINAL_COMMANDS)
        .map(([cmd, { description }]) => `  ${cmd.padEnd(12)} - ${description}`)
        .join('\n');
      return `사용 가능한 명령어:\n\n${commands}`;
    },
  },

  welcome: {
    description: '환영 메시지 표시',
    handler: () => {
      return `환영합니다! Cllaude99_Labs Terminal입니다.

프로젝트 관련 명령어를 실행할 수 있습니다.
'help'를 입력하여 사용 가능한 명령어를 확인하세요.`;
    },
  },

  projects: {
    description: '프로젝트 목록 표시',
    handler: () => {
      const projectList = PROJECTS.map(
        (p) =>
          `  [${p.id}] ${p.title}\n      ${p.description}\n      기술: ${p.techStack.join(', ')}`,
      ).join('\n\n');
      return `프로젝트 목록:\n\n${projectList}`;
    },
  },

  skills: {
    description: '기술 스택 표시',
    handler: () => {
      return `주요 기술 스택:

Frontend:
  - React 18 + TypeScript
  - Emotion (CSS-in-JS)
  - React Router v7
  - TanStack Query
  - Framer Motion

Backend:
  - Node.js + Express
  - PostgreSQL
  - Supabase

Tools:
  - Vite
  - Turborepo
  - pnpm`;
    },
  },

  about: {
    description: '프로젝트 소개',
    handler: () => {
      return `Cllaude99_Labs

관심있는 기술과 아이디어를 실험하는 공간입니다.

개발자: Cllaude99
GitHub: https://github.com/Cllaude99`;
    },
  },

  github: {
    description: 'GitHub 프로필 바로가기',
    handler: () => {
      return `깃허브 링크는 아래와 같아요.

https://github.com/Cllaude99`;
    },
  },

  clear: {
    description: '터미널 화면 지우기',
    handler: () => '',
  },

  date: {
    description: '현재 날짜 및 시간 표시',
    handler: () => {
      return new Date().toLocaleString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
    },
  },

  echo: {
    description: '입력한 텍스트를 그대로 출력',
    handler: (args) => args.join(' '),
  },
};

export { DOCK_ITEMS, TERMINAL_COMMANDS };
