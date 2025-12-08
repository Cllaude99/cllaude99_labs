import { Shape } from '../types';
import { normalizeRect } from './coordinates';

export type AlignmentType =
  | 'left'
  | 'center-horizontal'
  | 'right'
  | 'top'
  | 'middle-vertical'
  | 'bottom';

interface AlignedPosition {
  id: string;
  x: number;
  y: number;
}

/**
 * 선택된 도형들의 정렬된 위치 계산
 * @param shapes 정렬할 도형 배열 (2개 이상)
 * @param alignType 정렬 타입
 * @returns 각 도형의 새로운 x, y 좌표
 */
export function calculateAlignedPositions(
  shapes: Shape[],
  alignType: AlignmentType,
): AlignedPosition[] {
  if (shapes.length < 2) return [];

  // 1. 바운딩 박스 계산 (음수 width/height 정규화)
  const bounds = shapes.map((shape) => {
    const normalized = normalizeRect(
      shape.x,
      shape.y,
      shape.width,
      shape.height,
    );
    return {
      id: shape.id,
      left: normalized.x,
      right: normalized.x + normalized.width,
      top: normalized.y,
      bottom: normalized.y + normalized.height,
      centerX: normalized.x + normalized.width / 2,
      centerY: normalized.y + normalized.height / 2,
      width: normalized.width,
      height: normalized.height,
    };
  });

  // 2. 정렬 타입별 계산
  switch (alignType) {
    case 'left': {
      const minLeft = Math.min(...bounds.map((b) => b.left));
      return shapes.map((shape) => ({
        id: shape.id,
        x: minLeft,
        y: shape.y,
      }));
    }

    case 'center-horizontal': {
      const minLeft = Math.min(...bounds.map((b) => b.left));
      const maxRight = Math.max(...bounds.map((b) => b.right));
      const centerX = (minLeft + maxRight) / 2;
      return shapes.map((shape, i) => ({
        id: shape.id,
        x: centerX - bounds[i].width / 2,
        y: shape.y,
      }));
    }

    case 'right': {
      const maxRight = Math.max(...bounds.map((b) => b.right));
      return shapes.map((shape, i) => ({
        id: shape.id,
        x: maxRight - bounds[i].width,
        y: shape.y,
      }));
    }

    case 'top': {
      const minTop = Math.min(...bounds.map((b) => b.top));
      return shapes.map((shape) => ({
        id: shape.id,
        x: shape.x,
        y: minTop,
      }));
    }

    case 'middle-vertical': {
      const minTop = Math.min(...bounds.map((b) => b.top));
      const maxBottom = Math.max(...bounds.map((b) => b.bottom));
      const centerY = (minTop + maxBottom) / 2;
      return shapes.map((shape, i) => ({
        id: shape.id,
        x: shape.x,
        y: centerY - bounds[i].height / 2,
      }));
    }

    case 'bottom': {
      const maxBottom = Math.max(...bounds.map((b) => b.bottom));
      return shapes.map((shape, i) => ({
        id: shape.id,
        x: shape.x,
        y: maxBottom - bounds[i].height,
      }));
    }

    default:
      return [];
  }
}
