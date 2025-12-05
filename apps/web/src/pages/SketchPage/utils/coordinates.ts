import { Point, Viewport } from '../types';

/**
 * Screen 좌표를 Canvas 좌표로 변환
 * @param screenX 화면상의 X 좌표
 * @param screenY 화면상의 Y 좌표
 * @param viewport 현재 viewport 상태
 * @param stageWidth Stage의 너비
 * @param stageHeight Stage의 높이
 */
export function screenToCanvas(
  screenX: number,
  screenY: number,
  viewport: Viewport,
  stageWidth: number,
  stageHeight: number,
): Point {
  return {
    x: (screenX - stageWidth / 2) / viewport.zoom + viewport.x,
    y: (screenY - stageHeight / 2) / viewport.zoom + viewport.y,
  };
}

/**
 * Canvas 좌표를 Screen 좌표로 변환
 * @param canvasX 캔버스상의 X 좌표
 * @param canvasY 캔버스상의 Y 좌표
 * @param viewport 현재 viewport 상태
 * @param stageWidth Stage의 너비
 * @param stageHeight Stage의 높이
 */
export function canvasToScreen(
  canvasX: number,
  canvasY: number,
  viewport: Viewport,
  stageWidth: number,
  stageHeight: number,
): Point {
  return {
    x: (canvasX - viewport.x) * viewport.zoom + stageWidth / 2,
    y: (canvasY - viewport.y) * viewport.zoom + stageHeight / 2,
  };
}

/**
 * 마우스 휠 줌 시 viewport 계산
 * 마우스 위치를 기준으로 줌하여 자연스러운 경험 제공
 */
export function calculateZoomedViewport(
  mouseX: number,
  mouseY: number,
  currentViewport: Viewport,
  zoomDelta: number,
  stageWidth: number,
  stageHeight: number,
  minZoom: number = 0.1,
  maxZoom: number = 5,
): Viewport {
  const zoomFactor = 1 - zoomDelta * 0.02;
  const newZoom = Math.min(
    Math.max(currentViewport.zoom * zoomFactor, minZoom),
    maxZoom,
  );

  // 마우스 위치의 캔버스 좌표 계산
  const mouseCanvasX =
    (mouseX - stageWidth / 2) / currentViewport.zoom + currentViewport.x;
  const mouseCanvasY =
    (mouseY - stageHeight / 2) / currentViewport.zoom + currentViewport.y;

  // 새 줌 레벨에서 같은 캔버스 좌표가 마우스 위치에 오도록 viewport 조정
  const newX = mouseCanvasX - (mouseX - stageWidth / 2) / newZoom;
  const newY = mouseCanvasY - (mouseY - stageHeight / 2) / newZoom;

  return {
    x: newX,
    y: newY,
    zoom: newZoom,
  };
}

/**
 * 두 점 사이의 거리 계산
 */
export function getDistance(p1: Point, p2: Point): number {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * 포인트가 사각형 내부에 있는지 확인
 */
export function isPointInRect(
  point: Point,
  rectX: number,
  rectY: number,
  rectWidth: number,
  rectHeight: number,
): boolean {
  return (
    point.x >= rectX &&
    point.x <= rectX + rectWidth &&
    point.y >= rectY &&
    point.y <= rectY + rectHeight
  );
}

/**
 * 정규화된 사각형 좌표 반환 (width/height가 음수일 때 처리)
 */
export function normalizeRect(
  x: number,
  y: number,
  width: number,
  height: number,
): { x: number; y: number; width: number; height: number } {
  return {
    x: width < 0 ? x + width : x,
    y: height < 0 ? y + height : y,
    width: Math.abs(width),
    height: Math.abs(height),
  };
}
