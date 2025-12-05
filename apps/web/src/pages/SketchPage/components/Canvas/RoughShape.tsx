import { useMemo } from 'react';
import { Group, Image as KonvaImage, Rect } from 'react-konva';

import Konva from 'konva';
import rough from 'roughjs';

import { Shape } from '../../types';

interface RoughShapeProps {
  shape: Shape;
  isDraggable?: boolean;
  shapeRef?: (node: Konva.Group | null) => void;
  onClick?: () => void;
  onDragEnd?: (x: number, y: number) => void;
}

// shape.id 기반으로 안정적인 seed 생성
const generateSeed = (id: string): number => {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    const char = id.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
};

// 고해상도 지원을 위한 픽셀 비율
const PIXEL_RATIO = Math.min(window.devicePixelRatio || 1, 2);

const RoughShape = ({
  shape,
  isDraggable = false,
  shapeRef,
  onClick,
  onDragEnd,
}: RoughShapeProps) => {
  // 안정적인 seed 값 (도형 ID 기반)
  const seed = useMemo(() => generateSeed(shape.id), [shape.id]);

  // rough.js로 캔버스 이미지 생성 (고해상도)
  const canvasImage = useMemo(() => {
    const padding = shape.strokeWidth * 3;
    const drawWidth = Math.max(shape.width, 1);
    const drawHeight = Math.max(shape.height, 1);

    const canvasWidth = drawWidth + padding * 2;
    const canvasHeight = drawHeight + padding * 2;

    // 고해상도 캔버스 생성
    const canvas = document.createElement('canvas');
    canvas.width = canvasWidth * PIXEL_RATIO;
    canvas.height = canvasHeight * PIXEL_RATIO;
    canvas.style.width = `${canvasWidth}px`;
    canvas.style.height = `${canvasHeight}px`;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.scale(PIXEL_RATIO, PIXEL_RATIO);
    }

    const rc = rough.canvas(canvas);

    // Excalidraw 스타일 옵션 (더 깔끔한 손그림)
    const options = {
      roughness: shape.roughness,
      bowing: 0.5, // 곡선 휨 정도 낮춤
      stroke: shape.stroke,
      strokeWidth: shape.strokeWidth,
      fill: shape.fill !== 'transparent' ? shape.fill : undefined,
      fillStyle: 'solid' as const, // solid로 변경 (더 깔끔)
      curveFitting: 0.95, // 곡선 피팅 정도
      curveStepCount: 12, // 곡선 세밀도
      seed: seed,
    };

    switch (shape.type) {
      case 'rectangle': {
        rc.rectangle(padding, padding, drawWidth, drawHeight, options);
        break;
      }
      case 'ellipse': {
        rc.ellipse(
          padding + drawWidth / 2,
          padding + drawHeight / 2,
          drawWidth,
          drawHeight,
          options,
        );
        break;
      }
      case 'line': {
        if (shape.points && shape.points.length >= 4) {
          const [x1, y1, x2, y2] = shape.points;
          rc.line(
            x1 + padding,
            y1 + padding,
            x2 + padding,
            y2 + padding,
            options,
          );
        }
        break;
      }
      case 'arrow': {
        if (shape.points && shape.points.length >= 4) {
          const [x1, y1, x2, y2] = shape.points;
          const drawStartX = x1 + padding;
          const drawStartY = y1 + padding;
          const drawEndX = x2 + padding;
          const drawEndY = y2 + padding;

          // 메인 라인
          rc.line(drawStartX, drawStartY, drawEndX, drawEndY, options);

          // 화살표 헤드 (Excalidraw 스타일)
          const angle = Math.atan2(y2 - y1, x2 - x1);
          const headLength = 12;
          const headAngle = Math.PI / 7;

          const arrowX1 = drawEndX - headLength * Math.cos(angle - headAngle);
          const arrowY1 = drawEndY - headLength * Math.sin(angle - headAngle);
          const arrowX2 = drawEndX - headLength * Math.cos(angle + headAngle);
          const arrowY2 = drawEndY - headLength * Math.sin(angle + headAngle);

          rc.line(drawEndX, drawEndY, arrowX1, arrowY1, options);
          rc.line(drawEndX, drawEndY, arrowX2, arrowY2, options);
        }
        break;
      }
    }

    return { canvas, padding, canvasWidth, canvasHeight };
  }, [shape, seed]);

  const shapeWidth = Math.max(shape.width, 10);
  const shapeHeight = Math.max(shape.height, 10);
  const { canvas, padding, canvasWidth, canvasHeight } = canvasImage;

  return (
    <Group
      ref={shapeRef}
      x={shape.x}
      y={shape.y}
      rotation={shape.rotation || 0}
      draggable={isDraggable}
      onClick={onClick}
      onTap={onClick}
      onDragEnd={(e) => {
        onDragEnd?.(e.target.x(), e.target.y());
      }}
    >
      {/* 투명한 Rect로 클릭 영역 생성 */}
      <Rect
        width={shapeWidth}
        height={shapeHeight}
        fill="transparent"
        listening={true}
      />
      {/* rough.js로 그린 이미지 (고해상도 스케일 다운) */}
      <KonvaImage
        image={canvas}
        x={-padding}
        y={-padding}
        width={canvasWidth}
        height={canvasHeight}
        listening={false}
      />
    </Group>
  );
};

export default RoughShape;
