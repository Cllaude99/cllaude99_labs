import {
  ArrowUpRight,
  Circle,
  Hand,
  Minus,
  Moon,
  MousePointer2,
  Square,
  Sun,
} from 'lucide-react';

import * as S from './Toolbar.styles';
import { useSketchStore } from '../../stores/sketchStore';
import { ToolType } from '../../types';

interface ToolItem {
  id: ToolType;
  icon: React.ReactNode;
  label: string;
  shortcut: string;
}

const tools: ToolItem[] = [
  {
    id: 'hand',
    icon: <Hand />,
    label: '이동',
    shortcut: 'H',
  },
  {
    id: 'select',
    icon: <MousePointer2 />,
    label: '선택',
    shortcut: 'V',
  },
  {
    id: 'rectangle',
    icon: <Square />,
    label: '사각형',
    shortcut: 'R',
  },
  {
    id: 'ellipse',
    icon: <Circle />,
    label: '원',
    shortcut: 'O',
  },
  {
    id: 'line',
    icon: <Minus />,
    label: '선',
    shortcut: 'L',
  },
  {
    id: 'arrow',
    icon: <ArrowUpRight />,
    label: '화살표',
    shortcut: 'A',
  },
];

const Toolbar = () => {
  const { tool, theme, setTool, toggleTheme } = useSketchStore();

  return (
    <S.ToolbarContainer themeMode={theme}>
      {tools.map((toolItem) => (
        <S.ToolButtonWrapper key={toolItem.id}>
          <S.ToolButton
            themeMode={theme}
            isActive={tool === toolItem.id}
            onClick={() => setTool(toolItem.id)}
            aria-label={toolItem.label}
          >
            {toolItem.icon}
          </S.ToolButton>
          <S.Tooltip themeMode={theme}>
            {toolItem.label} ({toolItem.shortcut})
          </S.Tooltip>
        </S.ToolButtonWrapper>
      ))}

      <S.Divider themeMode={theme} />

      <S.ToolButtonWrapper>
        <S.ThemeToggleButton
          themeMode={theme}
          onClick={toggleTheme}
          aria-label="테마 변경"
        >
          {theme === 'light' ? <Moon /> : <Sun />}
        </S.ThemeToggleButton>
        <S.Tooltip themeMode={theme}>
          {theme === 'light' ? '다크 모드' : '라이트 모드'}
        </S.Tooltip>
      </S.ToolButtonWrapper>
    </S.ToolbarContainer>
  );
};

export default Toolbar;
