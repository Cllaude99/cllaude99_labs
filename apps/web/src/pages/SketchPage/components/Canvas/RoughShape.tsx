import { useMemo } from 'react';
import { Group, Image as KonvaImage, Rect, Text } from 'react-konva';

import Konva from 'konva';
import rough from 'roughjs';

import { Shape, ThemeMode } from '../../types';

interface RoughShapeProps {
  shape: Shape;
  isDraggable?: boolean;
  themeMode?: ThemeMode;
  isEditing?: boolean; // 텍스트 편집 중일 때 기존 텍스트 숨김
  shapeRef?: (node: Konva.Group | null) => void;
  onClick?: () => void;
  onDragEnd?: (x: number, y: number) => void;
  onDoubleClick?: () => void;
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

// 선/화살표 고정 gap 너비 (입력 중과 입력 후 동일하게 유지)
export const LINE_TEXT_GAP_WIDTH = 150;

const RoughShape = ({
  shape,
  isDraggable = false,
  themeMode = 'light',
  isEditing = false,
  shapeRef,
  onClick,
  onDragEnd,
  onDoubleClick,
}: RoughShapeProps) => {
  // 안정적인 seed 값 (도형 ID 기반)
  const seed = useMemo(() => generateSeed(shape.id), [shape.id]);

  // rough.js로 캔버스 이미지 생성 (고해상도)
  const canvasImage = useMemo(() => {
    // 텍스트 전용 타입의 경우 rough.js 렌더링 스킵
    if (shape.type === 'text') {
      const canvas = document.createElement('canvas');
      canvas.width = 1;
      canvas.height = 1;
      return { canvas, padding: 0, canvasWidth: 1, canvasHeight: 1 };
    }

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

          // 텍스트가 있거나 편집 중이면 중간에 gap 생성
          if (shape.text || isEditing) {
            const midX = (x1 + x2) / 2;
            const midY = (y1 + y2) / 2;

            // 선의 방향 벡터 정규화
            const dx = x2 - x1;
            const dy = y2 - y1;
            const length = Math.sqrt(dx * dx + dy * dy);

            // gap이 선 길이의 80%를 초과하지 않도록 제한 (고정 크기 사용)
            const maxGapWidth = length * 0.8;
            const gapWidth = Math.min(LINE_TEXT_GAP_WIDTH, maxGapWidth);

            if (length > 20) {
              // 최소 선 길이 확인
              const unitX = dx / length;
              const unitY = dy / length;

              // gap 시작/끝점 계산
              const gapStartX = midX - (unitX * gapWidth) / 2;
              const gapStartY = midY - (unitY * gapWidth) / 2;
              const gapEndX = midX + (unitX * gapWidth) / 2;
              const gapEndY = midY + (unitY * gapWidth) / 2;

              // 첫 번째 세그먼트 (시작점 ~ gap 시작)
              rc.line(
                x1 + padding,
                y1 + padding,
                gapStartX + padding,
                gapStartY + padding,
                options,
              );

              // 두 번째 세그먼트 (gap 끝 ~ 끝점)
              rc.line(
                gapEndX + padding,
                gapEndY + padding,
                x2 + padding,
                y2 + padding,
                options,
              );
            }
          } else {
            // 텍스트가 없으면 기존대로 한 줄
            rc.line(
              x1 + padding,
              y1 + padding,
              x2 + padding,
              y2 + padding,
              options,
            );
          }
        }
        break;
      }
      case 'arrow': {
        if (shape.points && shape.points.length >= 4) {
          const [x1, y1, x2, y2] = shape.points;
          const drawEndX = x2 + padding;
          const drawEndY = y2 + padding;

          // 화살표 헤드 계산 (항상 그려야 함)
          const angle = Math.atan2(y2 - y1, x2 - x1);
          const headLength = 12;
          const headAngle = Math.PI / 7;

          const arrowX1 = drawEndX - headLength * Math.cos(angle - headAngle);
          const arrowY1 = drawEndY - headLength * Math.sin(angle - headAngle);
          const arrowX2 = drawEndX - headLength * Math.cos(angle + headAngle);
          const arrowY2 = drawEndY - headLength * Math.sin(angle + headAngle);

          // 텍스트가 있거나 편집 중이면 중간에 gap 생성
          if (shape.text || isEditing) {
            const midX = (x1 + x2) / 2;
            const midY = (y1 + y2) / 2;

            // 선의 방향 벡터 정규화
            const dx = x2 - x1;
            const dy = y2 - y1;
            const length = Math.sqrt(dx * dx + dy * dy);

            // gap이 선 길이의 80%를 초과하지 않도록 제한 (고정 크기 사용)
            const maxGapWidth = length * 0.8;
            const gapWidth = Math.min(LINE_TEXT_GAP_WIDTH, maxGapWidth);

            if (length > 20) {
              // 최소 선 길이 확인
              const unitX = dx / length;
              const unitY = dy / length;

              // gap 시작/끝점 계산
              const gapStartX = midX - (unitX * gapWidth) / 2;
              const gapStartY = midY - (unitY * gapWidth) / 2;
              const gapEndX = midX + (unitX * gapWidth) / 2;
              const gapEndY = midY + (unitY * gapWidth) / 2;

              // 첫 번째 세그먼트 (시작점 ~ gap 시작)
              rc.line(
                x1 + padding,
                y1 + padding,
                gapStartX + padding,
                gapStartY + padding,
                options,
              );

              // 두 번째 세그먼트 (gap 끝 ~ 끝점)
              rc.line(
                gapEndX + padding,
                gapEndY + padding,
                x2 + padding,
                y2 + padding,
                options,
              );
            }
          } else {
            // 텍스트가 없으면 기존대로 한 줄
            rc.line(
              x1 + padding,
              y1 + padding,
              x2 + padding,
              y2 + padding,
              options,
            );
          }

          // 화살표 헤드 (항상 그림)
          rc.line(drawEndX, drawEndY, arrowX1, arrowY1, options);
          rc.line(drawEndX, drawEndY, arrowX2, arrowY2, options);
        }
        break;
      }
    }

    return { canvas, padding, canvasWidth, canvasHeight };
  }, [shape, seed, isEditing]);

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
      onDblClick={(e) => {
        e.cancelBubble = true;
        onDoubleClick?.();
      }}
      onDblTap={(e) => {
        e.cancelBubble = true;
        onDoubleClick?.();
      }}
      onDragEnd={(e) => {
        onDragEnd?.(e.target.x(), e.target.y());
      }}
    >
      {/* 텍스트 전용 타입이 아닌 경우에만 Rect와 Image 렌더링 */}
      {shape.type !== 'text' && (
        <>
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
        </>
      )}
      {/* 텍스트 렌더링 (편집 중일 때는 숨김) */}
      {shape.text &&
        !isEditing &&
        (() => {
          // text 타입의 경우
          if (shape.type === 'text') {
            return (
              <Text
                x={0}
                y={0}
                width={Math.abs(shape.width)}
                height={Math.abs(shape.height)}
                text={shape.text}
                fontSize={shape.fontSize || 16}
                fontFamily={shape.fontFamily || 'Inter, sans-serif'}
                fill={themeMode === 'light' ? '#1e1e1e' : '#e5e5e5'}
                align={shape.textAlign || 'center'}
                verticalAlign="middle"
                wrap="word"
                listening={true} // text 타입은 클릭 가능해야 함
              />
            );
          }

          // Rectangle/Ellipse의 경우 기존 로직 유지
          if (shape.type === 'rectangle' || shape.type === 'ellipse') {
            return (
              <Text
                x={0}
                y={0}
                width={Math.abs(shape.width)}
                height={Math.abs(shape.height)}
                text={shape.text}
                fontSize={shape.fontSize || 16}
                fontFamily={shape.fontFamily || 'Inter, sans-serif'}
                fill={themeMode === 'light' ? '#1e1e1e' : '#e5e5e5'}
                align={shape.textAlign || 'center'}
                verticalAlign="middle"
                wrap="word"
                listening={false}
              />
            );
          }

          // Line/Arrow의 경우 중앙점 계산
          if (
            (shape.type === 'line' || shape.type === 'arrow') &&
            shape.points
          ) {
            const [x1, y1, x2, y2] = shape.points;

            // 선의 중앙점
            const midX = (x1 + x2) / 2;
            const midY = (y1 + y2) / 2;

            // 텍스트 너비 (gap 너비와 동일하게)
            const textWidth = LINE_TEXT_GAP_WIDTH;
            const fontSize = shape.fontSize || 16;
            const lineHeight = 1.2;

            // 충분히 큰 높이를 설정하고 verticalAlign으로 중앙 정렬
            const maxTextHeight = 500;

            return (
              <Text
                x={midX - textWidth / 2}
                y={midY - maxTextHeight / 2}
                width={textWidth}
                height={maxTextHeight}
                text={shape.text}
                fontSize={fontSize}
                lineHeight={lineHeight}
                fontFamily={shape.fontFamily || 'Inter, sans-serif'}
                fill={themeMode === 'light' ? '#1e1e1e' : '#e5e5e5'}
                align="center"
                verticalAlign="middle"
                wrap="word"
                listening={false}
              />
            );
          }

          return null;
        })()}
    </Group>
  );
};

export default RoughShape;
