import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import generateLocalStorageKey from '@/utils/generateLocalStorageKey';

import { DrawingState, Shape, ThemeMode, ToolType, Viewport } from '../types';

// LocalStorage 키 값
const THEME_STORAGE_KEY = generateLocalStorageKey('sketch_theme');

interface SketchState {
  // 도구 관련
  tool: ToolType;
  setTool: (tool: ToolType) => void;

  // 도형 관련
  shapes: Shape[];
  addShape: (shape: Shape) => void;
  updateShape: (id: string, updates: Partial<Shape>) => void;
  deleteShape: (id: string) => void;
  setShapes: (shapes: Shape[]) => void;

  // 선택된 도형
  selectedShapeIds: string[];
  setSelectedShapeIds: (ids: string[]) => void;
  clearSelection: () => void;

  // Viewport 관련
  viewport: Viewport;
  setViewport: (viewport: Partial<Viewport>) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;

  // 드래그 상태
  drawingState: DrawingState;
  setDrawingState: (state: Partial<DrawingState>) => void;
  resetDrawingState: () => void;

  // 스타일 설정
  strokeColor: string;
  fillColor: string;
  strokeWidth: number;
  roughness: number;
  setStrokeColor: (color: string) => void;
  setFillColor: (color: string) => void;
  setStrokeWidth: (width: number) => void;
  setRoughness: (roughness: number) => void;

  // 테마
  theme: ThemeMode;
  toggleTheme: () => void;
  setTheme: (theme: ThemeMode) => void;

  // Space 키 상태 (팬 모드)
  isSpacePressed: boolean;
  setIsSpacePressed: (pressed: boolean) => void;
}

const INITIAL_VIEWPORT: Viewport = {
  x: 0,
  y: 0,
  zoom: 1,
};

const INITIAL_DRAWING_STATE: DrawingState = {
  isDrawing: false,
  startPoint: null,
  currentShape: null,
};

const MIN_ZOOM = 0.1;
const MAX_ZOOM = 5;
const ZOOM_STEP = 0.1;

// 테마별 기본 색상
const THEME_STROKE_COLORS = {
  light: '#1e1e1e',
  dark: '#e5e5e5',
} as const;

export const useSketchStore = create<SketchState>()(
  persist(
    (set) => ({
      // 도구 관련
      tool: 'hand',
      setTool: (tool) => set({ tool }),

      // 도형 관련
      shapes: [],
      addShape: (shape) =>
        set((state) => ({ shapes: [...state.shapes, shape] })),
      updateShape: (id, updates) =>
        set((state) => ({
          shapes: state.shapes.map((shape) =>
            shape.id === id ? { ...shape, ...updates } : shape,
          ),
        })),
      deleteShape: (id) =>
        set((state) => ({
          shapes: state.shapes.filter((shape) => shape.id !== id),
          selectedShapeIds: state.selectedShapeIds.filter(
            (shapeId) => shapeId !== id,
          ),
        })),
      setShapes: (shapes) => set({ shapes }),

      // 선택된 도형
      selectedShapeIds: [],
      setSelectedShapeIds: (ids) => set({ selectedShapeIds: ids }),
      clearSelection: () => set({ selectedShapeIds: [] }),

      // Viewport 관련
      viewport: INITIAL_VIEWPORT,
      setViewport: (viewport) =>
        set((state) => ({
          viewport: { ...state.viewport, ...viewport },
        })),
      zoomIn: () =>
        set((state) => ({
          viewport: {
            ...state.viewport,
            zoom: Math.min(state.viewport.zoom + ZOOM_STEP, MAX_ZOOM),
          },
        })),
      zoomOut: () =>
        set((state) => ({
          viewport: {
            ...state.viewport,
            zoom: Math.max(state.viewport.zoom - ZOOM_STEP, MIN_ZOOM),
          },
        })),
      resetZoom: () =>
        set((state) => ({
          viewport: { ...state.viewport, zoom: 1 },
        })),

      // 드래그 상태
      drawingState: INITIAL_DRAWING_STATE,
      setDrawingState: (drawingState) =>
        set((state) => ({
          drawingState: { ...state.drawingState, ...drawingState },
        })),
      resetDrawingState: () => set({ drawingState: INITIAL_DRAWING_STATE }),

      // 스타일 설정
      strokeColor: '#1e1e1e',
      fillColor: 'transparent',
      strokeWidth: 1.5,
      roughness: 0.5,
      setStrokeColor: (strokeColor) => set({ strokeColor }),
      setFillColor: (fillColor) => set({ fillColor }),
      setStrokeWidth: (strokeWidth) => set({ strokeWidth }),
      setRoughness: (roughness) => set({ roughness }),

      // 테마
      theme: 'light',
      toggleTheme: () =>
        set((state) => {
          const newTheme = state.theme === 'light' ? 'dark' : 'light';
          const oldStrokeColor = THEME_STROKE_COLORS[state.theme];
          const newStrokeColor = THEME_STROKE_COLORS[newTheme];

          // 기존 도형들의 stroke 색상도 변경 (기본 색상으로 그려진 도형만)
          const updatedShapes = state.shapes.map((shape) => ({
            ...shape,
            stroke:
              shape.stroke === oldStrokeColor ? newStrokeColor : shape.stroke,
          }));

          return {
            theme: newTheme,
            strokeColor: newStrokeColor,
            shapes: updatedShapes,
          };
        }),
      setTheme: (theme) =>
        set((state) => {
          const oldStrokeColor = THEME_STROKE_COLORS[state.theme];
          const newStrokeColor = THEME_STROKE_COLORS[theme];

          const updatedShapes = state.shapes.map((shape) => ({
            ...shape,
            stroke:
              shape.stroke === oldStrokeColor ? newStrokeColor : shape.stroke,
          }));

          return {
            theme,
            strokeColor: newStrokeColor,
            shapes: updatedShapes,
          };
        }),

      // Space 키 상태
      isSpacePressed: false,
      setIsSpacePressed: (isSpacePressed) => set({ isSpacePressed }),
    }),
    {
      name: THEME_STORAGE_KEY,
      // 테마 관련 설정만 localStorage에 저장
      partialize: (state) => ({
        theme: state.theme,
        strokeColor: state.strokeColor,
        fillColor: state.fillColor,
        strokeWidth: state.strokeWidth,
        roughness: state.roughness,
      }),
    },
  ),
);

// ID 생성 유틸리티
export const generateShapeId = (): string => {
  return `shape_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
};
