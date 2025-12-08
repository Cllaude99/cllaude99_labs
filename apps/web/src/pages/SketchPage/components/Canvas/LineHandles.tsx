import { Circle, Group } from 'react-konva';

import Konva from 'konva';

import { Shape, ThemeMode, Viewport } from '../../types';

interface LineHandlesProps {
  shape: Shape;
  viewport: Viewport;
  themeMode: ThemeMode;
  onStartPointDrag: (x: number, y: number) => void;
  onEndPointDrag: (x: number, y: number) => void;
  onControlPointDrag: (x: number, y: number) => void;
  onDragEnd: () => void;
}

// 핸들 스타일 상수
const HANDLE_RADIUS = 6;
const HANDLE_STROKE_WIDTH = 1.5;
const HANDLE_COLORS = {
  light: {
    fill: '#FFFFFF',
    stroke: '#5B8FF9',
    controlFill: 'rgba(91, 143, 249, 0.3)',
  },
  dark: {
    fill: '#1e1e1e',
    stroke: '#5B8FF9',
    controlFill: 'rgba(91, 143, 249, 0.3)',
  },
};

const LineHandles = ({
  shape,
  viewport,
  themeMode,
  onStartPointDrag,
  onEndPointDrag,
  onControlPointDrag,
  onDragEnd,
}: LineHandlesProps) => {
  if (!shape.points || shape.points.length < 4) return null;

  const colors = HANDLE_COLORS[themeMode];
  const handleRadius = HANDLE_RADIUS / viewport.zoom;
  const strokeWidth = HANDLE_STROKE_WIDTH / viewport.zoom;

  // 직선: [x1, y1, x2, y2]
  // 곡선: [x1, y1, cx, cy, x2, y2]
  const isCurved = shape.isCurved && shape.points.length >= 6;

  let startX: number, startY: number, endX: number, endY: number;
  let controlX: number, controlY: number;

  if (isCurved) {
    [startX, startY, controlX, controlY, endX, endY] = shape.points;
  } else {
    [startX, startY, endX, endY] = shape.points;
    // 직선일 때 컨트롤 포인트는 중앙점
    controlX = (startX + endX) / 2;
    controlY = (startY + endY) / 2;
  }

  // 베지어 곡선의 중간점 계산 (t=0.5) - 텍스트 위치
  // 제어점을 항상 이 위치에 표시
  let displayControlX: number, displayControlY: number;
  if (isCurved) {
    const t = 0.5;
    displayControlX = (1 - t) * (1 - t) * startX + 2 * (1 - t) * t * controlX + t * t * endX;
    displayControlY = (1 - t) * (1 - t) * startY + 2 * (1 - t) * t * controlY + t * t * endY;
  } else {
    displayControlX = controlX;
    displayControlY = controlY;
  }

  // 절대 좌표로 변환
  const absStartX = shape.x + startX;
  const absStartY = shape.y + startY;
  const absEndX = shape.x + endX;
  const absEndY = shape.y + endY;
  const absControlX = shape.x + displayControlX;
  const absControlY = shape.y + displayControlY;

  // 드래그 핸들러
  const handleStartDrag = (e: Konva.KonvaEventObject<DragEvent>) => {
    const node = e.target;
    const newX = node.x() - shape.x;
    const newY = node.y() - shape.y;
    onStartPointDrag(newX, newY);
  };

  const handleEndDrag = (e: Konva.KonvaEventObject<DragEvent>) => {
    const node = e.target;
    const newX = node.x() - shape.x;
    const newY = node.y() - shape.y;
    onEndPointDrag(newX, newY);
  };

  const handleControlDrag = (e: Konva.KonvaEventObject<DragEvent>) => {
    const node = e.target;
    const draggedX = node.x() - shape.x;
    const draggedY = node.y() - shape.y;
    
    // 드래그한 위치(t=0.5 지점)에서 실제 베지어 제어점을 역계산
    // 베지어 곡선: B(0.5) = 0.25*P0 + 0.5*P1 + 0.25*P2
    // P1 = (B(0.5) - 0.25*P0 - 0.25*P2) / 0.5
    const actualControlX = (draggedX - 0.25 * startX - 0.25 * endX) / 0.5;
    const actualControlY = (draggedY - 0.25 * startY - 0.25 * endY) / 0.5;
    
    onControlPointDrag(actualControlX, actualControlY);
  };

  return (
    <Group>
      {/* 시작점 핸들 */}
      <Circle
        x={absStartX}
        y={absStartY}
        radius={handleRadius}
        fill={colors.fill}
        stroke={colors.stroke}
        strokeWidth={strokeWidth}
        draggable
        onDragMove={handleStartDrag}
        onDragEnd={onDragEnd}
        hitStrokeWidth={handleRadius * 2}
      />

      {/* 끝점 핸들 */}
      <Circle
        x={absEndX}
        y={absEndY}
        radius={handleRadius}
        fill={colors.fill}
        stroke={colors.stroke}
        strokeWidth={strokeWidth}
        draggable
        onDragMove={handleEndDrag}
        onDragEnd={onDragEnd}
        hitStrokeWidth={handleRadius * 2}
      />

      {/* 중앙 컨트롤 포인트 핸들 */}
      <Circle
        x={absControlX}
        y={absControlY}
        radius={handleRadius * 0.8}
        fill={colors.controlFill}
        stroke={colors.stroke}
        strokeWidth={strokeWidth}
        draggable
        onDragMove={handleControlDrag}
        onDragEnd={onDragEnd}
        hitStrokeWidth={handleRadius * 2}
      />
    </Group>
  );
};

export default LineHandles;

