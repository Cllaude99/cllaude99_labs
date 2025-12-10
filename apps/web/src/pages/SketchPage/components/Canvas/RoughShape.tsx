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

  // points 배열을 문자열로 변환하여 안정적인 비교 (배열 참조 변경으로 인한 불필요한 렌더링 방지)
  const pointsKey = shape.points ? shape.points.join(',') : '';

  // rough.js로 캔버스 이미지 생성 (고해상도)
  const canvasImage = useMemo(() => {
    // 텍스트 전용 타입의 경우 rough.js 렌더링 스킵
    if (shape.type === 'text') {
      const canvas = document.createElement('canvas');
      canvas.width = 1;
      canvas.height = 1;
      return { canvas, padding: 0, canvasWidth: 1, canvasHeight: 1 };
    }

    // 곡선인 경우 더 큰 padding 사용 (제어점이 bounding box 밖에 있을 수 있음)
    const isCurvedLine =
      (shape.type === 'line' || shape.type === 'arrow') &&
      shape.isCurved &&
      shape.points &&
      shape.points.length >= 6;
    const padding = isCurvedLine
      ? Math.max(shape.strokeWidth * 15, 30) // 곡선은 더 큰 padding
      : shape.strokeWidth * 5;

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
          // 곡선인 경우 베지어 커브 렌더링
          if (shape.isCurved && shape.points.length >= 6) {
            const [x1, y1, cx, cy, x2, y2] = shape.points;

            // 텍스트가 있으면 곡선을 두 부분으로 나눔
            if (shape.text || isEditing) {
              // 베지어 곡선 분할 지점
              const t1 = 0.35; // 첫 번째 곡선 끝 (gap 시작)
              const t2 = 0.65; // 두 번째 곡선 시작 (gap 끝)

              // De Casteljau's algorithm으로 첫 번째 세그먼트 계산 (0 ~ t1)
              const q0x = x1 + (cx - x1) * t1;
              const q0y = y1 + (cy - y1) * t1;
              const q1x = cx + (x2 - cx) * t1;
              const q1y = cy + (y2 - cy) * t1;
              const split1X = q0x + (q1x - q0x) * t1;
              const split1Y = q0y + (q1y - q0y) * t1;
              const cx1 = q0x;
              const cy1 = q0y;

              // De Casteljau's algorithm으로 두 번째 세그먼트 계산 (t2 ~ 1)
              const r0x = x1 + (cx - x1) * t2;
              const r0y = y1 + (cy - y1) * t2;
              const r1x = cx + (x2 - cx) * t2;
              const r1y = cy + (y2 - cy) * t2;
              const split2X = r0x + (r1x - r0x) * t2;
              const split2Y = r0y + (r1y - r0y) * t2;
              const cx2 = r1x;
              const cy2 = r1y;

              // 첫 번째 세그먼트 (시작 ~ gap 시작) - Quadratic Bezier
              const path1 = `M ${x1 + padding} ${y1 + padding} Q ${cx1 + padding} ${cy1 + padding} ${split1X + padding} ${split1Y + padding}`;
              rc.path(path1, options);

              // 두 번째 세그먼트 (gap 끝 ~ 끝점) - Quadratic Bezier
              const path2 = `M ${split2X + padding} ${split2Y + padding} Q ${cx2 + padding} ${cy2 + padding} ${x2 + padding} ${y2 + padding}`;
              rc.path(path2, options);
            } else {
              // 텍스트 없으면 전체 곡선 그리기 (Quadratic Bezier path 사용)
              const path = `M ${x1 + padding} ${y1 + padding} Q ${cx + padding} ${cy + padding} ${x2 + padding} ${y2 + padding}`;
              rc.path(path, options);
            }
          } else {
            // 직선인 경우
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
        }
        break;
      }
      case 'arrow': {
        if (shape.points && shape.points.length >= 4) {
          // 곡선인 경우 베지어 커브 렌더링
          if (shape.isCurved && shape.points.length >= 6) {
            const [x1, y1, cx, cy, x2, y2] = shape.points;
            const drawEndX = x2 + padding;
            const drawEndY = y2 + padding;

            // 텍스트가 있으면 곡선을 두 부분으로 나눔
            if (shape.text || isEditing) {
              // 베지어 곡선 분할 지점
              const t1 = 0.35; // 첫 번째 곡선 끝 (gap 시작)
              const t2 = 0.65; // 두 번째 곡선 시작 (gap 끝)

              // De Casteljau's algorithm으로 첫 번째 세그먼트 계산 (0 ~ t1)
              const q0x = x1 + (cx - x1) * t1;
              const q0y = y1 + (cy - y1) * t1;
              const q1x = cx + (x2 - cx) * t1;
              const q1y = cy + (y2 - cy) * t1;
              const split1X = q0x + (q1x - q0x) * t1;
              const split1Y = q0y + (q1y - q0y) * t1;
              const cx1 = q0x;
              const cy1 = q0y;

              // De Casteljau's algorithm으로 두 번째 세그먼트 계산 (t2 ~ 1)
              const r0x = x1 + (cx - x1) * t2;
              const r0y = y1 + (cy - y1) * t2;
              const r1x = cx + (x2 - cx) * t2;
              const r1y = cy + (y2 - cy) * t2;
              const split2X = r0x + (r1x - r0x) * t2;
              const split2Y = r0y + (r1y - r0y) * t2;
              const cx2 = r1x;
              const cy2 = r1y;

              // 첫 번째 세그먼트 (시작 ~ gap 시작) - Quadratic Bezier
              const arrowPath1 = `M ${x1 + padding} ${y1 + padding} Q ${cx1 + padding} ${cy1 + padding} ${split1X + padding} ${split1Y + padding}`;
              rc.path(arrowPath1, options);

              // 두 번째 세그먼트 (gap 끝 ~ 끝점) - Quadratic Bezier
              const arrowPath2 = `M ${split2X + padding} ${split2Y + padding} Q ${cx2 + padding} ${cy2 + padding} ${x2 + padding} ${y2 + padding}`;
              rc.path(arrowPath2, options);
            } else {
              // 텍스트 없으면 전체 곡선 그리기 (Quadratic Bezier path 사용)
              const arrowPath = `M ${x1 + padding} ${y1 + padding} Q ${cx + padding} ${cy + padding} ${x2 + padding} ${y2 + padding}`;
              rc.path(arrowPath, options);
            }

            // 화살표 헤드 - 곡선의 끝점 방향 계산
            // 제어점에서 끝점으로의 방향을 사용
            const angle = Math.atan2(y2 - cy, x2 - cx);
            const headLength = 12;
            const headAngle = Math.PI / 7;

            const arrowX1 = drawEndX - headLength * Math.cos(angle - headAngle);
            const arrowY1 = drawEndY - headLength * Math.sin(angle - headAngle);
            const arrowX2 = drawEndX - headLength * Math.cos(angle + headAngle);
            const arrowY2 = drawEndY - headLength * Math.sin(angle + headAngle);

            rc.line(drawEndX, drawEndY, arrowX1, arrowY1, options);
            rc.line(drawEndX, drawEndY, arrowX2, arrowY2, options);
          } else {
            // 직선인 경우
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
        }
        break;
      }
    }

    return { canvas, padding, canvasWidth, canvasHeight };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    shape.type,
    shape.width,
    shape.height,
    pointsKey, // points 대신 pointsKey 사용 (배열 참조 변경 최적화)
    shape.isCurved,
    shape.stroke,
    shape.strokeWidth,
    shape.fill,
    shape.roughness,
    shape.text,
    isEditing,
    seed,
  ]);

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
      {/* 투명한 Rect로 클릭 영역 생성 (모든 타입) */}
      <Rect
        width={shapeWidth}
        height={shapeHeight}
        fill="transparent"
        listening={true}
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
      />

      {/* 텍스트 전용 타입이 아닌 경우에만 Image 렌더링 */}
      {shape.type !== 'text' && (
        <>
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
                listening={false} // Rect가 이벤트를 처리하도록 변경
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
            let midX: number, midY: number;

            // 곡선인 경우 베지어 곡선의 중간점 계산
            if (shape.isCurved && shape.points.length >= 6) {
              const [x1, y1, cx, cy, x2, y2] = shape.points;
              // 베지어 곡선의 중간점 (t=0.5)
              const t = 0.5;
              midX = (1 - t) * (1 - t) * x1 + 2 * (1 - t) * t * cx + t * t * x2;
              midY = (1 - t) * (1 - t) * y1 + 2 * (1 - t) * t * cy + t * t * y2;
            } else {
              // 직선인 경우 단순 중앙점
              const [x1, y1, x2, y2] = shape.points;
              midX = (x1 + x2) / 2;
              midY = (y1 + y2) / 2;
            }

            // 텍스트 설정
            const fontSize = shape.fontSize || 16;
            const lineHeight = 1.2;
            const backgroundColor =
              themeMode === 'light' ? '#ffffff' : '#1e1e1e';

            // 텍스트의 실제 크기를 측정하기 위한 임시 Text 노드 생성
            const text = shape.text || '';

            // Konva의 measureText를 사용하여 실제 텍스트 크기 계산
            const tempText = new Konva.Text({
              text: text,
              fontSize: fontSize,
              lineHeight: lineHeight,
              fontFamily: shape.fontFamily || 'Inter, sans-serif',
              width: LINE_TEXT_GAP_WIDTH,
              align: 'center',
              wrap: 'word',
            });

            const textWidth = tempText.width();
            const textHeight = tempText.height();

            // 임시 노드 제거
            tempText.destroy();

            // 최소 패딩으로 텍스트 배경 생성
            const bgPaddingX = 4;
            const bgPaddingY = 2;

            return (
              <>
                {/* 텍스트 배경 - 선이 끊긴 부분을 덮음 */}
                <Rect
                  x={midX - textWidth / 2 - bgPaddingX}
                  y={midY - textHeight / 2 - bgPaddingY}
                  width={textWidth + bgPaddingX * 2}
                  height={textHeight + bgPaddingY * 2}
                  fill={backgroundColor}
                  listening={false}
                />
                {/* 텍스트 */}
                <Text
                  x={midX - textWidth / 2}
                  y={midY - textHeight / 2}
                  width={textWidth}
                  text={shape.text}
                  fontSize={fontSize}
                  lineHeight={lineHeight}
                  fontFamily={shape.fontFamily || 'Inter, sans-serif'}
                  fill={themeMode === 'light' ? '#1e1e1e' : '#e5e5e5'}
                  align="center"
                  verticalAlign="top"
                  wrap="word"
                  listening={false}
                />
              </>
            );
          }

          return null;
        })()}
    </Group>
  );
};

export default RoughShape;
