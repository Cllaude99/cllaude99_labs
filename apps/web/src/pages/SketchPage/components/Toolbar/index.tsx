import { useCallback } from 'react';

import {
  ArrowUpRight,
  BringToFront,
  Circle,
  Hand,
  Minus,
  Moon,
  MousePointer2,
  SendToBack,
  Square,
  Sun,
} from 'lucide-react';

import * as S from './Toolbar.styles';
import { useSketchStore } from '../../stores/sketchStore';
import { ToolType } from '../../types';
import ColorPicker from '../ColorPicker';

interface ToolItem {
  id: ToolType;
  icon: React.ReactNode;
  label: string;
  shortcut: string;
}

const tools: ToolItem[] = [
  {
    id: 'hand',
    icon: <Hand strokeWidth={1.5} />,
    label: '이동',
    shortcut: 'H',
  },
  {
    id: 'select',
    icon: <MousePointer2 strokeWidth={1.5} />,
    label: '선택',
    shortcut: 'V',
  },
  {
    id: 'rectangle',
    icon: <Square strokeWidth={1.5} />,
    label: '사각형',
    shortcut: 'R',
  },
  {
    id: 'ellipse',
    icon: <Circle strokeWidth={1.5} />,
    label: '원',
    shortcut: 'O',
  },
  {
    id: 'line',
    icon: <Minus strokeWidth={1.5} />,
    label: '선',
    shortcut: 'L',
  },
  {
    id: 'arrow',
    icon: <ArrowUpRight strokeWidth={1.5} />,
    label: '화살표',
    shortcut: 'A',
  },
];


const Toolbar = () => {
  const {
    tool,
    theme,
    selectedShapeIds,
    fillColor,
    strokeColor,
    setTool,
    setFillColor,
    setStrokeColor,
    toggleTheme,
    updateShape,
    bringToFront,
    sendToBack,
  } = useSketchStore();

  // 색상 변경 핸들러
  const handleFillColorChange = useCallback(
    (color: string) => {
      setFillColor(color);
      // 선택된 도형이 있으면 일괄 변경
      if (selectedShapeIds.length > 0) {
        selectedShapeIds.forEach((id) => updateShape(id, { fill: color }));
      }
    },
    [selectedShapeIds, setFillColor, updateShape],
  );

  const handleStrokeColorChange = useCallback(
    (color: string) => {
      setStrokeColor(color);
      if (selectedShapeIds.length > 0) {
        selectedShapeIds.forEach((id) => updateShape(id, { stroke: color }));
      }
    },
    [selectedShapeIds, setStrokeColor, updateShape],
  );

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

      {/* 색상 선택 */}
      <S.ToolButtonWrapper>
        <ColorPicker
          type="fill"
          currentColor={fillColor}
          onChange={handleFillColorChange}
          themeMode={theme}
        />
        <S.Tooltip themeMode={theme}>채우기 색상 (1-9)</S.Tooltip>
      </S.ToolButtonWrapper>

      <S.ToolButtonWrapper>
        <ColorPicker
          type="stroke"
          currentColor={strokeColor}
          onChange={handleStrokeColorChange}
          themeMode={theme}
        />
        <S.Tooltip themeMode={theme}>선 색상</S.Tooltip>
      </S.ToolButtonWrapper>

      <S.Divider themeMode={theme} />

      {/* Z-Index 버튼 (선택된 도형 있을 때만 활성화) */}
      <S.ToolButtonWrapper>
        <S.ToolButton
          themeMode={theme}
          isActive={false}
          disabled={selectedShapeIds.length === 0}
          onClick={() => bringToFront(selectedShapeIds)}
          aria-label="맨 앞으로"
        >
          <BringToFront strokeWidth={1.5} />
        </S.ToolButton>
        <S.Tooltip themeMode={theme}>맨 앞으로 (Ctrl+])</S.Tooltip>
      </S.ToolButtonWrapper>

      <S.ToolButtonWrapper>
        <S.ToolButton
          themeMode={theme}
          isActive={false}
          disabled={selectedShapeIds.length === 0}
          onClick={() => sendToBack(selectedShapeIds)}
          aria-label="맨 뒤로"
        >
          <SendToBack strokeWidth={1.5} />
        </S.ToolButton>
        <S.Tooltip themeMode={theme}>맨 뒤로 (Ctrl+[)</S.Tooltip>
      </S.ToolButtonWrapper>

      <S.Divider themeMode={theme} />

      <S.ToolButtonWrapper>
        <S.ThemeToggleButton
          themeMode={theme}
          onClick={toggleTheme}
          aria-label="테마 변경"
        >
          {theme === 'light' ? <Moon strokeWidth={1.5} /> : <Sun strokeWidth={1.5} />}
        </S.ThemeToggleButton>
        <S.Tooltip themeMode={theme}>
          {theme === 'light' ? '다크 모드' : '라이트 모드'}
        </S.Tooltip>
      </S.ToolButtonWrapper>
    </S.ToolbarContainer>
  );
};

export default Toolbar;
