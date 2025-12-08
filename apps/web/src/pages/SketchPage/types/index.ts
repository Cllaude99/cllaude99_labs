// 도형 타입
export type ShapeType = 'rectangle' | 'ellipse' | 'line' | 'arrow' | 'text';

export interface Shape {
  id: string;
  type: ShapeType;
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
  stroke: string;
  strokeWidth: number;
  roughness: number; // rough.js 손그림 강도 (0: 깔끔, 3: 거친 손그림)
  rotation?: number;
  points?: number[]; // line, arrow용 포인트 배열 [x1, y1, x2, y2] 또는 곡선 [x1, y1, cx, cy, x2, y2]
  isCurved?: boolean; // 곡선 여부 (베지어 커브)

  // 텍스트 관련
  text?: string;
  fontSize?: number; // 기본값: 16
  fontFamily?: string; // 기본값: 'Inter, sans-serif'
  textAlign?: 'left' | 'center' | 'right'; // 기본값: 'center'
}

// 도구 타입
export type ToolType =
  | 'select'
  | 'hand'
  | 'rectangle'
  | 'ellipse'
  | 'line'
  | 'arrow';

// Viewport 타입
export interface Viewport {
  x: number;
  y: number;
  zoom: number; // 0.1 ~ 5.0
}

// 테마 타입
export type ThemeMode = 'light' | 'dark';

// 캔버스 포인트 타입
export interface Point {
  x: number;
  y: number;
}

// 드래그 상태 타입
export interface DrawingState {
  isDrawing: boolean;
  startPoint: Point | null;
  currentShape: Shape | null;
}
