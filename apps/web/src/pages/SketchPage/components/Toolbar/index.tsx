import { useCallback } from 'react';

import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  AlignVerticalJustifyCenter,
  AlignVerticalJustifyEnd,
  AlignVerticalJustifyStart,
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
import { AlignmentType } from '../../utils/alignment';
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

// 정렬 도구 정의
const alignmentTools = [
  {
    type: 'left' as AlignmentType,
    icon: <AlignLeft />,
    label: '왼쪽 정렬',
  },
  {
    type: 'center-horizontal' as AlignmentType,
    icon: <AlignCenter />,
    label: '가로 중앙 정렬',
  },
  {
    type: 'right' as AlignmentType,
    icon: <AlignRight />,
    label: '오른쪽 정렬',
  },
  {
    type: 'top' as AlignmentType,
    icon: <AlignVerticalJustifyStart />,
    label: '위쪽 정렬',
  },
  {
    type: 'middle-vertical' as AlignmentType,
    icon: <AlignVerticalJustifyCenter />,
    label: '세로 중앙 정렬',
  },
  {
    type: 'bottom' as AlignmentType,
    icon: <AlignVerticalJustifyEnd />,
    label: '아래쪽 정렬',
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
    alignShapes,
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
          <BringToFront />
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
          <SendToBack />
        </S.ToolButton>
        <S.Tooltip themeMode={theme}>맨 뒤로 (Ctrl+[)</S.Tooltip>
      </S.ToolButtonWrapper>

      {/* 정렬 버튼 (2개 이상 선택 시만 표시) */}
      {selectedShapeIds.length >= 2 && (
        <>
          <S.Divider themeMode={theme} />

          {alignmentTools.map((align) => (
            <S.ToolButtonWrapper key={align.type}>
              <S.ToolButton
                themeMode={theme}
                isActive={false}
                onClick={() => alignShapes(selectedShapeIds, align.type)}
                aria-label={align.label}
              >
                {align.icon}
              </S.ToolButton>
              <S.Tooltip themeMode={theme}>{align.label}</S.Tooltip>
            </S.ToolButtonWrapper>
          ))}
        </>
      )}

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
