import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Layer, Rect, Stage, Transformer } from 'react-konva';

import Konva from 'konva';

import * as S from './Canvas.styles';
import LineHandles from './LineHandles';
import RoughShape from './RoughShape';
import TextEditor from './TextEditor';
import { FILL_COLORS } from '../../constants/colors';
import { generateShapeId, useSketchStore } from '../../stores/sketchStore';
import { Point, Shape } from '../../types';
import {
  calculateZoomedViewport,
  normalizeRect,
  screenToCanvas,
} from '../../utils/coordinates';

// 선택 영역 박스 타입
interface SelectionBox {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

const Canvas = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<Konva.Stage>(null);
  const transformerRef = useRef<Konva.Transformer>(null);
  const shapeRefs = useRef<Map<string, Konva.Group>>(new Map());
  const [stageSize, setStageSize] = useState({ width: 0, height: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [selectionBox, setSelectionBox] = useState<SelectionBox | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const [editingShapeId, setEditingShapeId] = useState<string | null>(null);
  const [isDraggingGroup, setIsDraggingGroup] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  const lastPointerPosition = useRef<Point | null>(null);

  const {
    tool,
    shapes,
    viewport,
    theme,
    strokeColor,
    fillColor,
    strokeWidth,
    roughness,
    drawingState,
    selectedShapeIds,
    isSpacePressed,
    addShape,
    updateShape,
    setViewport,
    setDrawingState,
    resetDrawingState,
    setSelectedShapeIds,
    clearSelection,
    setIsSpacePressed,
  } = useSketchStore();

  // Stage 크기 업데이트
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setStageSize({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Zustand에서 액션들 가져오기
  const setTool = useSketchStore((state) => state.setTool);
  const setFillColor = useSketchStore((state) => state.setFillColor);
  const deleteShape = useSketchStore((state) => state.deleteShape);
  const selectAllShapes = useSketchStore((state) => state.selectAllShapes);
  const duplicateShapes = useSketchStore((state) => state.duplicateShapes);
  const bringToFront = useSketchStore((state) => state.bringToFront);
  const sendToBack = useSketchStore((state) => state.sendToBack);
  const copyShapes = useSketchStore((state) => state.copyShapes);
  const pasteShapes = useSketchStore((state) => state.pasteShapes);

  // 키보드 이벤트 핸들러
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 입력 필드에서는 단축키 무시
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      // Mac/Windows Ctrl/Cmd 감지
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const isCtrlOrCmd = isMac ? e.metaKey : e.ctrlKey;

      if (e.code === 'Space' && !isSpacePressed) {
        e.preventDefault();
        setIsSpacePressed(true);
      }

      // Ctrl+A: 전체 선택
      if (isCtrlOrCmd && e.code === 'KeyA') {
        e.preventDefault(); // 브라우저 기본 전체 선택 방지
        selectAllShapes();
        return;
      }

      // Ctrl+C: 복사
      if (isCtrlOrCmd && e.code === 'KeyC') {
        e.preventDefault();
        const ids = useSketchStore.getState().selectedShapeIds;
        if (ids.length > 0) {
          copyShapes(ids);
        }
        return;
      }

      // Ctrl+V: 붙여넣기
      if (isCtrlOrCmd && e.code === 'KeyV') {
        e.preventDefault();
        pasteShapes();
        return;
      }

      // Ctrl+D: 복제
      if (isCtrlOrCmd && e.code === 'KeyD') {
        e.preventDefault(); // 브라우저 북마크 추가 방지
        const ids = useSketchStore.getState().selectedShapeIds;
        if (ids.length > 0) {
          duplicateShapes(ids);
        }
        return;
      }

      // Ctrl+]: 맨 앞으로
      if (isCtrlOrCmd && e.key === ']') {
        e.preventDefault();
        const ids = useSketchStore.getState().selectedShapeIds;
        if (ids.length > 0) {
          bringToFront(ids);
        }
        return;
      }

      // Ctrl+[: 맨 뒤로
      if (isCtrlOrCmd && e.key === '[') {
        e.preventDefault();
        const ids = useSketchStore.getState().selectedShapeIds;
        if (ids.length > 0) {
          sendToBack(ids);
        }
        return;
      }

      // Digit1-9: 채우기 색상 빠른 변경 (Ctrl/Cmd 없이)
      if (e.code.startsWith('Digit') && !isCtrlOrCmd) {
        const colorIndex = parseInt(e.code.replace('Digit', '')) - 1;
        if (colorIndex >= 0 && colorIndex < FILL_COLORS.length) {
          e.preventDefault();
          const newColor = FILL_COLORS[colorIndex].value;
          setFillColor(newColor);

          // 선택된 도형이 있으면 일괄 변경
          const ids = useSketchStore.getState().selectedShapeIds;
          if (ids.length > 0) {
            ids.forEach((id) => updateShape(id, { fill: newColor }));
          }
          return;
        }
      }

      // 도구 단축키 (Ctrl/Cmd 없이) - e.code로 물리적 키 위치 감지 (한/영 모두 지원)
      if (!isCtrlOrCmd) {
        switch (e.code) {
          case 'KeyV': // V 또는 ㅍ
            setTool('select');
            break;
          case 'KeyH': // H 또는 ㅗ
            setTool('hand');
            break;
          case 'KeyR': // R 또는 ㄱ
            setTool('rectangle');
            break;
          case 'KeyO': // O 또는 ㅐ
            setTool('ellipse');
            break;
          case 'KeyL': // L 또는 ㅣ
            setTool('line');
            break;
          case 'KeyA': // A 또는 ㅁ
            setTool('arrow');
            break;
        }
      }

      // Delete 키로 선택된 도형 삭제
      if (e.key === 'Delete' || e.key === 'Backspace') {
        const ids = useSketchStore.getState().selectedShapeIds;
        ids.forEach((id) => deleteShape(id));
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        setIsSpacePressed(false);
        setIsPanning(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [
    isSpacePressed,
    setIsSpacePressed,
    setTool,
    setFillColor,
    updateShape,
    deleteShape,
    selectAllShapes,
    duplicateShapes,
    bringToFront,
    sendToBack,
    copyShapes,
    pasteShapes,
  ]);

  // 선택된 도형 중 선/화살표 찾기 (다중 선택 포함)
  const selectedLinesAndArrows = shapes.filter(
    (s) =>
      selectedShapeIds.includes(s.id) &&
      (s.type === 'line' || s.type === 'arrow'),
  );

  // Transformer 업데이트 (선택된 도형이 변경될 때)
  useEffect(() => {
    if (!transformerRef.current) return;

    const selectedNodes: Konva.Group[] = [];
    selectedShapeIds.forEach((id) => {
      const shape = shapes.find((s) => s.id === id);
      // 선/화살표는 LineHandles 사용하므로 Transformer에서 제외
      if (shape && shape.type !== 'line' && shape.type !== 'arrow') {
        const node = shapeRefs.current.get(id);
        if (node) {
          selectedNodes.push(node);
        }
      }
    });

    transformerRef.current.nodes(selectedNodes);
    transformerRef.current.getLayer()?.batchDraw();
  }, [selectedShapeIds, shapes]);

  // Transformer의 bounding box를 계산 (선택된 도형이 있을 때만)
  const transformerBoundingBox = useMemo(() => {
    if (!transformerRef.current || selectedShapeIds.length === 0) return null;

    // 선/화살표가 아닌 도형만 포함
    const nonLineShapes = shapes.filter(
      (s) =>
        selectedShapeIds.includes(s.id) &&
        s.type !== 'line' &&
        s.type !== 'arrow',
    );

    if (nonLineShapes.length === 0) return null;

    // 모든 도형의 bounding box 계산
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    nonLineShapes.forEach((shape) => {
      minX = Math.min(minX, shape.x);
      minY = Math.min(minY, shape.y);
      maxX = Math.max(maxX, shape.x + shape.width);
      maxY = Math.max(maxY, shape.y + shape.height);
    });

    return {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY,
    };
  }, [selectedShapeIds, shapes]);

  // 휠/트랙패드 핸들러
  const handleWheel = useCallback(
    (e: Konva.KonvaEventObject<WheelEvent>) => {
      e.evt.preventDefault();
      const stage = stageRef.current;
      if (!stage) return;

      const pointerPos = stage.getPointerPosition();
      if (!pointerPos) return;

      // ctrlKey 또는 metaKey가 눌린 경우 (트랙패드 핀치 또는 Ctrl/Cmd+휠) → 확대/축소
      if (e.evt.ctrlKey || e.evt.metaKey) {
        const newViewport = calculateZoomedViewport(
          pointerPos.x,
          pointerPos.y,
          viewport,
          e.evt.deltaY,
          stageSize.width,
          stageSize.height,
        );
        setViewport(newViewport);
      } else {
        // 일반 스크롤 → 캔버스 이동 (팬)
        setViewport({
          x: viewport.x + e.evt.deltaX / viewport.zoom,
          y: viewport.y + e.evt.deltaY / viewport.zoom,
        });
      }
    },
    [viewport, stageSize, setViewport],
  );

  // 마우스 다운 핸들러
  const handleMouseDown = useCallback(
    (e: Konva.KonvaEventObject<MouseEvent>) => {
      const stage = stageRef.current;
      if (!stage) return;

      const pointerPos = stage.getPointerPosition();
      if (!pointerPos) return;

      // Space 키가 눌려있거나 hand 도구면 팬 모드
      if (isSpacePressed || tool === 'hand') {
        setIsPanning(true);
        lastPointerPosition.current = pointerPos;
        return;
      }

      // select 도구에서 빈 영역 클릭 시 선택 박스 준비
      if (tool === 'select' && e.target === stage) {
        // 빈 공간 클릭: 선택 해제하고 선택 박스 준비
        clearSelection();
        const canvasPoint = screenToCanvas(
          pointerPos.x,
          pointerPos.y,
          viewport,
          stageSize.width,
          stageSize.height,
        );
        setSelectionBox({
          startX: canvasPoint.x,
          startY: canvasPoint.y,
          endX: canvasPoint.x,
          endY: canvasPoint.y,
        });
        setIsSelecting(true);
        return;
      }

      // 도형 그리기 시작
      if (
        tool === 'rectangle' ||
        tool === 'ellipse' ||
        tool === 'line' ||
        tool === 'arrow'
      ) {
        const canvasPoint = screenToCanvas(
          pointerPos.x,
          pointerPos.y,
          viewport,
          stageSize.width,
          stageSize.height,
        );

        const newShape: Shape = {
          id: generateShapeId(),
          type: tool,
          x: canvasPoint.x,
          y: canvasPoint.y,
          width: 0,
          height: 0,
          fill: fillColor,
          stroke: strokeColor,
          strokeWidth: strokeWidth,
          roughness: roughness,
          points:
            tool === 'line' || tool === 'arrow' ? [0, 0, 0, 0] : undefined,
        };

        setDrawingState({
          isDrawing: true,
          startPoint: canvasPoint,
          currentShape: newShape,
        });
      }
    },
    [
      tool,
      isSpacePressed,
      viewport,
      stageSize,
      strokeColor,
      fillColor,
      strokeWidth,
      roughness,
      clearSelection,
      setDrawingState,
    ],
  );

  // 마우스 이동 핸들러
  const handleMouseMove = useCallback(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const pointerPos = stage.getPointerPosition();
    if (!pointerPos) return;

    // 팬 모드
    if (isPanning && lastPointerPosition.current) {
      const dx = pointerPos.x - lastPointerPosition.current.x;
      const dy = pointerPos.y - lastPointerPosition.current.y;

      setViewport({
        x: viewport.x - dx / viewport.zoom,
        y: viewport.y - dy / viewport.zoom,
      });

      lastPointerPosition.current = pointerPos;
      return;
    }

    // 선택 박스 드래그 중
    if (isSelecting && selectionBox) {
      const canvasPoint = screenToCanvas(
        pointerPos.x,
        pointerPos.y,
        viewport,
        stageSize.width,
        stageSize.height,
      );

      // 드래그 거리 계산
      const dx = canvasPoint.x - selectionBox.startX;
      const dy = canvasPoint.y - selectionBox.startY;
      const dragDistance = Math.sqrt(dx * dx + dy * dy);

      // 드래그 거리가 작고 (5px 이하) 선택된 도형이 있으면 팬 모드로 전환
      if (dragDistance < 5 && selectedShapeIds.length > 0) {
        setIsSelecting(false);
        setSelectionBox(null);
        setIsPanning(true);
        lastPointerPosition.current = pointerPos;
        return;
      }

      setSelectionBox({
        ...selectionBox,
        endX: canvasPoint.x,
        endY: canvasPoint.y,
      });
      return;
    }

    // 도형 그리기 중
    if (
      drawingState.isDrawing &&
      drawingState.startPoint &&
      drawingState.currentShape
    ) {
      const canvasPoint = screenToCanvas(
        pointerPos.x,
        pointerPos.y,
        viewport,
        stageSize.width,
        stageSize.height,
      );

      const rawWidth = canvasPoint.x - drawingState.startPoint.x;
      const rawHeight = canvasPoint.y - drawingState.startPoint.y;

      // 사각형/원의 경우 정규화된 좌표 사용 (음수 width/height 처리)
      const isLineType =
        drawingState.currentShape.type === 'line' ||
        drawingState.currentShape.type === 'arrow';

      let updatedShape: Shape;

      if (isLineType) {
        // 선/화살표: 바운딩 박스 좌상단을 x, y로, points는 박스 기준 상대 좌표
        const startX = drawingState.startPoint.x;
        const startY = drawingState.startPoint.y;
        const endX = canvasPoint.x;
        const endY = canvasPoint.y;

        const minX = Math.min(startX, endX);
        const minY = Math.min(startY, endY);
        const width = Math.abs(rawWidth);
        const height = Math.abs(rawHeight);

        // points는 바운딩 박스 기준 상대 좌표
        const relStartX = startX - minX;
        const relStartY = startY - minY;
        const relEndX = endX - minX;
        const relEndY = endY - minY;

        updatedShape = {
          ...drawingState.currentShape,
          x: minX,
          y: minY,
          width: width,
          height: height,
          points: [relStartX, relStartY, relEndX, relEndY],
        };
      } else {
        // 사각형/원은 정규화하여 항상 양수 width/height 사용
        const normalized = normalizeRect(
          drawingState.startPoint.x,
          drawingState.startPoint.y,
          rawWidth,
          rawHeight,
        );
        updatedShape = {
          ...drawingState.currentShape,
          x: normalized.x,
          y: normalized.y,
          width: normalized.width,
          height: normalized.height,
        };
      }

      setDrawingState({ currentShape: updatedShape });
    }
  }, [
    isPanning,
    viewport,
    stageSize,
    drawingState,
    isSelecting,
    selectionBox,
    setViewport,
    setDrawingState,
  ]);

  // 도형이 선택 영역 내에 있는지 확인
  const isShapeInSelectionBox = useCallback(
    (shape: Shape, box: SelectionBox): boolean => {
      const boxLeft = Math.min(box.startX, box.endX);
      const boxRight = Math.max(box.startX, box.endX);
      const boxTop = Math.min(box.startY, box.endY);
      const boxBottom = Math.max(box.startY, box.endY);

      let shapeLeft: number,
        shapeRight: number,
        shapeTop: number,
        shapeBottom: number;

      // Line/Arrow는 points 배열로 bounding box 계산
      if ((shape.type === 'line' || shape.type === 'arrow') && shape.points) {
        if (shape.isCurved && shape.points.length >= 6) {
          // 곡선인 경우: 시작점, 제어점, 끝점 모두 고려
          const [x1, y1, cx, cy, x2, y2] = shape.points;
          const allX = [shape.x + x1, shape.x + cx, shape.x + x2];
          const allY = [shape.y + y1, shape.y + cy, shape.y + y2];
          shapeLeft = Math.min(...allX);
          shapeRight = Math.max(...allX);
          shapeTop = Math.min(...allY);
          shapeBottom = Math.max(...allY);
        } else {
          // 직선인 경우: 시작점과 끝점
          const [x1, y1, x2, y2] = shape.points;
          shapeLeft = Math.min(shape.x + x1, shape.x + x2);
          shapeRight = Math.max(shape.x + x1, shape.x + x2);
          shapeTop = Math.min(shape.y + y1, shape.y + y2);
          shapeBottom = Math.max(shape.y + y1, shape.y + y2);
        }
      } else {
        // Rectangle/Ellipse/Text는 기존 로직
        shapeLeft = shape.x;
        shapeRight = shape.x + shape.width;
        shapeTop = shape.y;
        shapeBottom = shape.y + shape.height;
      }

      // 도형이 선택 영역과 겹치는지 확인
      return !(
        shapeRight < boxLeft ||
        shapeLeft > boxRight ||
        shapeBottom < boxTop ||
        shapeTop > boxBottom
      );
    },
    [],
  );

  // 마우스 업 핸들러
  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
    lastPointerPosition.current = null;

    // 선택 박스 드래그 완료
    if (isSelecting && selectionBox) {
      const selectedIds: string[] = [];
      shapes.forEach((shape) => {
        if (isShapeInSelectionBox(shape, selectionBox)) {
          selectedIds.push(shape.id);
        }
      });
      if (selectedIds.length > 0) {
        setSelectedShapeIds(selectedIds);
      }
      setSelectionBox(null);
      setIsSelecting(false);
      return;
    }

    // 도형 그리기 완료
    if (drawingState.isDrawing && drawingState.currentShape) {
      const shape = drawingState.currentShape;
      const isLineType = shape.type === 'line' || shape.type === 'arrow';

      // 최소 크기 확인 (5px 이상)
      if (shape.width > 5 || shape.height > 5) {
        let finalShape: Shape;

        if (isLineType) {
          // 선/화살표는 이미 정규화된 상태
          finalShape = { ...shape };
        } else {
          // 사각형/원은 정규화 (이미 handleMouseMove에서 처리됨)
          finalShape = { ...shape };
        }

        addShape(finalShape);
        // 도형 그리기 완료 후 자동 선택 (Transformer 표시)
        setSelectedShapeIds([finalShape.id]);
        // 도형 생성 후 자동으로 선택 도구로 전환
        setTool('select');
      }

      resetDrawingState();
    }
  }, [
    drawingState,
    addShape,
    resetDrawingState,
    isSelecting,
    selectionBox,
    shapes,
    isShapeInSelectionBox,
    setSelectedShapeIds,
    setTool,
  ]);

  // 도형 클릭 핸들러
  const handleShapeClick = useCallback(
    (shapeId: string) => {
      if (tool === 'select') {
        setSelectedShapeIds([shapeId]);
      }
    },
    [tool, setSelectedShapeIds],
  );

  // 도형 드래그 완료 핸들러
  const handleShapeDragEnd = useCallback(
    (shapeId: string, x: number, y: number) => {
      updateShape(shapeId, { x, y });
    },
    [updateShape],
  );

  // 도형 더블클릭 핸들러 (텍스트 편집 모드 진입)
  const handleShapeDoubleClick = useCallback(
    (shapeId: string) => {
      const shape = shapes.find((s) => s.id === shapeId);
      if (!shape) return;

      // 모든 도형은 도구와 관계없이 더블클릭 시 텍스트 편집 가능
      setEditingShapeId(shapeId);

      // 도형을 선택 상태로 만듦
      if (!selectedShapeIds.includes(shapeId)) {
        setSelectedShapeIds([shapeId]);
      }
    },
    [shapes, selectedShapeIds, setSelectedShapeIds],
  );

  // Stage 더블클릭 핸들러 (빈 공간에서 텍스트 생성)
  const handleStageDoubleClick = useCallback(
    (e: Konva.KonvaEventObject<MouseEvent>) => {
      const stage = stageRef.current;
      if (!stage) return;

      // Stage 자체 클릭 (도형이 아닌 빈 공간)
      if (e.target === stage) {
        const pointerPos = stage.getPointerPosition();
        if (!pointerPos) return;

        const canvasPoint = screenToCanvas(
          pointerPos.x,
          pointerPos.y,
          viewport,
          stageSize.width,
          stageSize.height,
        );

        // 텍스트 전용 도형 생성
        const newShape: Shape = {
          id: generateShapeId(),
          type: 'text',
          x: canvasPoint.x - 100, // width의 절반만큼 왼쪽으로 이동 (중앙 배치)
          y: canvasPoint.y - 20, // height의 절반만큼 위로 이동 (중앙 배치)
          width: 200,
          height: 40,
          fill: 'transparent',
          stroke: 'transparent',
          strokeWidth: 0,
          roughness: 0,
          text: '',
        };

        addShape(newShape);
        setEditingShapeId(newShape.id);
      }
    },
    [viewport, stageSize, addShape],
  );

  // 도형 변형 완료 핸들러 (크기 조절, 회전)
  const handleTransformEnd = useCallback(() => {
    selectedShapeIds.forEach((id) => {
      const node = shapeRefs.current.get(id);
      if (!node) return;

      const scaleX = node.scaleX();
      const scaleY = node.scaleY();

      // 스케일 리셋하고 실제 크기로 변환
      node.scaleX(1);
      node.scaleY(1);

      const shape = shapes.find((s) => s.id === id);
      if (!shape) return;

      // 기본 업데이트 객체
      const updates: Partial<Shape> = {
        x: node.x(),
        y: node.y(),
        width: Math.max(shape.width * scaleX, 10),
        height: Math.max(shape.height * scaleY, 10),
        rotation: node.rotation(),
      };

      // line/arrow의 경우 points도 scale에 맞게 업데이트
      if (
        (shape.type === 'line' || shape.type === 'arrow') &&
        shape.points &&
        shape.points.length >= 4
      ) {
        const [x1, y1, x2, y2] = shape.points;
        updates.points = [x1 * scaleX, y1 * scaleY, x2 * scaleX, y2 * scaleY];
      }

      updateShape(id, updates);
    });
  }, [selectedShapeIds, shapes, updateShape]);

  // LineHandles 핸들러 - 시작점 드래그
  const handleLineStartPointDrag = useCallback(
    (shapeId: string, newX: number, newY: number) => {
      const shape = shapes.find((s) => s.id === shapeId);
      if (!shape || !shape.points || shape.points.length < 4) return;

      const isCurved = shape.isCurved && shape.points.length >= 6;

      if (isCurved) {
        const [, , cx, cy, x2, y2] = shape.points;
        // 바운딩 박스 재계산
        const minX = Math.min(newX, cx, x2);
        const minY = Math.min(newY, cy, y2);
        const maxX = Math.max(newX, cx, x2);
        const maxY = Math.max(newY, cy, y2);

        updateShape(shape.id, {
          x: shape.x + minX,
          y: shape.y + minY,
          width: maxX - minX,
          height: maxY - minY,
          points: [
            newX - minX,
            newY - minY,
            cx - minX,
            cy - minY,
            x2 - minX,
            y2 - minY,
          ],
        });
      } else {
        const [, , x2, y2] = shape.points;
        // 바운딩 박스 재계산
        const minX = Math.min(newX, x2);
        const minY = Math.min(newY, y2);
        const maxX = Math.max(newX, x2);
        const maxY = Math.max(newY, y2);

        updateShape(shape.id, {
          x: shape.x + minX,
          y: shape.y + minY,
          width: maxX - minX,
          height: maxY - minY,
          points: [newX - minX, newY - minY, x2 - minX, y2 - minY],
        });
      }
    },
    [shapes, updateShape],
  );

  // LineHandles 핸들러 - 끝점 드래그
  const handleLineEndPointDrag = useCallback(
    (shapeId: string, newX: number, newY: number) => {
      const shape = shapes.find((s) => s.id === shapeId);
      if (!shape || !shape.points || shape.points.length < 4) return;

      const isCurved = shape.isCurved && shape.points.length >= 6;

      if (isCurved) {
        const [x1, y1, cx, cy] = shape.points;
        // 바운딩 박스 재계산
        const minX = Math.min(x1, cx, newX);
        const minY = Math.min(y1, cy, newY);
        const maxX = Math.max(x1, cx, newX);
        const maxY = Math.max(y1, cy, newY);

        updateShape(shape.id, {
          x: shape.x + minX,
          y: shape.y + minY,
          width: maxX - minX,
          height: maxY - minY,
          points: [
            x1 - minX,
            y1 - minY,
            cx - minX,
            cy - minY,
            newX - minX,
            newY - minY,
          ],
        });
      } else {
        const [x1, y1] = shape.points;
        // 바운딩 박스 재계산
        const minX = Math.min(x1, newX);
        const minY = Math.min(y1, newY);
        const maxX = Math.max(x1, newX);
        const maxY = Math.max(y1, newY);

        updateShape(shape.id, {
          x: shape.x + minX,
          y: shape.y + minY,
          width: maxX - minX,
          height: maxY - minY,
          points: [x1 - minX, y1 - minY, newX - minX, newY - minY],
        });
      }
    },
    [shapes, updateShape],
  );

  // LineHandles 핸들러 - 컨트롤 포인트 드래그 (곡선 생성)
  const handleLineControlPointDrag = useCallback(
    (shapeId: string, newX: number, newY: number) => {
      const shape = shapes.find((s) => s.id === shapeId);
      if (!shape || !shape.points || shape.points.length < 4) return;

      let x1: number, y1: number, x2: number, y2: number;

      if (shape.isCurved && shape.points.length >= 6) {
        [x1, y1, , , x2, y2] = shape.points;
      } else {
        [x1, y1, x2, y2] = shape.points;
      }

      // 바운딩 박스 재계산
      const minX = Math.min(x1, newX, x2);
      const minY = Math.min(y1, newY, y2);
      const maxX = Math.max(x1, newX, x2);
      const maxY = Math.max(y1, newY, y2);

      updateShape(shape.id, {
        x: shape.x + minX,
        y: shape.y + minY,
        width: maxX - minX,
        height: maxY - minY,
        points: [
          x1 - minX,
          y1 - minY,
          newX - minX,
          newY - minY,
          x2 - minX,
          y2 - minY,
        ],
        isCurved: true,
      });
    },
    [shapes, updateShape],
  );

  // LineHandles 드래그 완료 핸들러
  const handleLineDragEnd = useCallback(() => {
    // 드래그 완료 시 추가 처리가 필요하면 여기에 작성
  }, []);

  // 커서 스타일 결정
  const getCursorClass = (): string => {
    if (isRotating) return 'grabbing';
    if (isPanning) return 'grabbing';
    if (isSpacePressed || tool === 'hand') return 'grab';
    if (
      tool === 'rectangle' ||
      tool === 'ellipse' ||
      tool === 'line' ||
      tool === 'arrow'
    ) {
      return 'crosshair';
    }
    return 'default';
  };

  // 선택 박스 계산
  const getSelectionBoxRect = () => {
    if (!selectionBox) return null;
    const x = Math.min(selectionBox.startX, selectionBox.endX);
    const y = Math.min(selectionBox.startY, selectionBox.endY);
    const width = Math.abs(selectionBox.endX - selectionBox.startX);
    const height = Math.abs(selectionBox.endY - selectionBox.startY);
    return { x, y, width, height };
  };

  // Stage 변환 계산
  const stageX = stageSize.width / 2 - viewport.x * viewport.zoom;
  const stageY = stageSize.height / 2 - viewport.y * viewport.zoom;

  const selectionRect = getSelectionBoxRect();

  return (
    <S.CanvasContainer
      ref={containerRef}
      themeMode={theme}
      isRotating={isRotating}
      className={getCursorClass()}
      style={{ cursor: getCursorClass() }}
    >
      <Stage
        ref={stageRef}
        width={stageSize.width}
        height={stageSize.height}
        x={stageX}
        y={stageY}
        scaleX={viewport.zoom}
        scaleY={viewport.zoom}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onDblClick={handleStageDoubleClick}
      >
        {/* 도형 레이어 */}
        <Layer>
          {shapes.map((shape) => (
            <RoughShape
              key={shape.id}
              shape={shape}
              isDraggable={tool === 'select'}
              themeMode={theme}
              isEditing={editingShapeId === shape.id}
              shapeRef={(node) => {
                if (node) {
                  shapeRefs.current.set(shape.id, node);
                } else {
                  shapeRefs.current.delete(shape.id);
                }
              }}
              onClick={() => handleShapeClick(shape.id)}
              onDragEnd={(x, y) => handleShapeDragEnd(shape.id, x, y)}
              onDoubleClick={() => handleShapeDoubleClick(shape.id)}
            />
          ))}

          {/* 그리는 중인 도형 */}
          {drawingState.isDrawing && drawingState.currentShape && (
            <RoughShape shape={drawingState.currentShape} themeMode={theme} />
          )}

          {/* Transformer 드래그 가능 영역 (투명 배경) - Transformer보다 먼저 렌더링 */}
          {transformerBoundingBox && (
            <Rect
              x={transformerBoundingBox.x}
              y={transformerBoundingBox.y}
              width={transformerBoundingBox.width}
              height={transformerBoundingBox.height}
              fill="transparent"
              listening={true}
              draggable={true}
              onMouseEnter={(e) => {
                const stage = e.target.getStage();
                if (stage) {
                  stage.container().style.cursor = 'move';
                }
              }}
              onMouseLeave={(e) => {
                const stage = e.target.getStage();
                if (stage) {
                  stage.container().style.cursor = 'default';
                }
              }}
              onDblClick={(e) => {
                e.cancelBubble = true;
                // 선택된 도형이 하나일 때 텍스트 편집 모드로 진입
                if (selectedShapeIds.length === 1) {
                  handleShapeDoubleClick(selectedShapeIds[0]);
                } else if (selectedShapeIds.length > 1) {
                  // 여러 도형이 선택된 경우 클릭 위치의 도형 찾기
                  const stage = e.target.getStage();
                  if (!stage) return;
                  const pointerPos = stage.getPointerPosition();
                  if (!pointerPos) return;

                  const canvasPoint = screenToCanvas(
                    pointerPos.x,
                    pointerPos.y,
                    viewport,
                    stageSize.width,
                    stageSize.height,
                  );

                  // 선택된 도형 중 클릭 위치에 있는 도형 찾기 (역순으로 검색 - 위에 있는 것 우선)
                  const clickedShape = [...shapes].reverse().find((shape) => {
                    if (!selectedShapeIds.includes(shape.id)) return false;
                    return (
                      canvasPoint.x >= shape.x &&
                      canvasPoint.x <= shape.x + shape.width &&
                      canvasPoint.y >= shape.y &&
                      canvasPoint.y <= shape.y + shape.height
                    );
                  });

                  if (clickedShape) {
                    handleShapeDoubleClick(clickedShape.id);
                  }
                }
              }}
              onDblTap={(e) => {
                e.cancelBubble = true;
                // 선택된 도형이 하나일 때 텍스트 편집 모드로 진입
                if (selectedShapeIds.length === 1) {
                  handleShapeDoubleClick(selectedShapeIds[0]);
                }
              }}
              onDragStart={() => {
                setIsDraggingGroup(true);
              }}
              onDragMove={(e) => {
                if (!isDraggingGroup) return;

                const dx = e.target.x() - transformerBoundingBox.x;
                const dy = e.target.y() - transformerBoundingBox.y;

                // 모든 선택된 도형 이동
                selectedShapeIds.forEach((id) => {
                  const shape = shapes.find((s) => s.id === id);
                  if (shape) {
                    updateShape(id, {
                      x: shape.x + dx,
                      y: shape.y + dy,
                    });
                  }
                });

                // Rect 위치 리셋
                e.target.position({
                  x: transformerBoundingBox.x,
                  y: transformerBoundingBox.y,
                });
              }}
              onDragEnd={() => {
                setIsDraggingGroup(false);
              }}
            />
          )}

          {/* Excalidraw 스타일 Transformer - 마지막에 렌더링해야 앵커가 위에 표시됨 */}
          <Transformer
            ref={transformerRef}
            rotateEnabled={true}
            rotationSnaps={[0, 45, 90, 135, 180, 225, 270, 315]}
            rotateAnchorOffset={20}
            rotateAnchorCursor="grab"
            enabledAnchors={[
              'top-left',
              'top-center',
              'top-right',
              'middle-left',
              'middle-right',
              'bottom-left',
              'bottom-center',
              'bottom-right',
            ]}
            boundBoxFunc={(oldBox, newBox) => {
              // 최소 크기 제한
              if (newBox.width < 10 || newBox.height < 10) {
                return oldBox;
              }
              return newBox;
            }}
            anchorSize={8}
            anchorCornerRadius={2}
            anchorStroke="#5B8FF9"
            anchorFill="#FFFFFF"
            anchorStrokeWidth={1}
            borderStroke="#5B8FF9"
            borderStrokeWidth={1}
            borderDash={[]}
            onTransformStart={() => {
              // 변형(회전 포함) 시작 시 grabbing 커서로 변경
              setIsRotating(true);
            }}
            onTransformEnd={() => {
              handleTransformEnd();
              // 변형 종료 시 커서 복원
              setIsRotating(false);
            }}
            onDragEnd={handleTransformEnd}
            onMouseDown={(e) => {
              // 회전 앵커에서 마우스를 누르면 grabbing 커서로 변경
              const targetName = e.target.name() || '';
              if (targetName.includes('rotater')) {
                const stage = e.target.getStage();
                if (stage) {
                  stage.container().style.cursor = 'grabbing';
                }
              }
            }}
            onMouseUp={(e) => {
              // 마우스를 떼면 회전 앵커 위에 있으면 grab, 아니면 default
              const targetName = e.target.name() || '';
              const stage = e.target.getStage();
              if (stage) {
                if (targetName.includes('rotater')) {
                  stage.container().style.cursor = 'grab';
                } else {
                  stage.container().style.cursor = 'default';
                }
              }
            }}
            onMouseLeave={(e) => {
              const stage = e.target.getStage();
              if (stage) {
                stage.container().style.cursor = 'default';
              }
            }}
          />

          {/* 선/화살표 전용 커스텀 핸들 (다중 선택 포함) */}
          {selectedLinesAndArrows.map((shape) => (
            <LineHandles
              key={shape.id}
              shape={shape}
              viewport={viewport}
              themeMode={theme}
              onStartPointDrag={(x, y) =>
                handleLineStartPointDrag(shape.id, x, y)
              }
              onEndPointDrag={(x, y) => handleLineEndPointDrag(shape.id, x, y)}
              onControlPointDrag={(x, y) =>
                handleLineControlPointDrag(shape.id, x, y)
              }
              onDragEnd={handleLineDragEnd}
            />
          ))}

          {/* 선택 영역 박스 */}
          {selectionRect && (
            <Rect
              x={selectionRect.x}
              y={selectionRect.y}
              width={selectionRect.width}
              height={selectionRect.height}
              fill="rgba(91, 143, 249, 0.1)"
              stroke="#5B8FF9"
              strokeWidth={1 / viewport.zoom}
              listening={false}
            />
          )}
        </Layer>
      </Stage>

      {/* 텍스트 편집 오버레이 */}
      {editingShapeId && (
        <TextEditor
          shape={shapes.find((s) => s.id === editingShapeId)!}
          viewport={viewport}
          stageSize={stageSize}
          themeMode={theme}
          onSave={(text) => {
            // 텍스트가 비어있으면 도형 삭제, 그렇지 않으면 업데이트
            if (!text || text.trim() === '') {
              deleteShape(editingShapeId);
            } else {
              updateShape(editingShapeId, { text });
            }
            setEditingShapeId(null);
          }}
          onCancel={() => setEditingShapeId(null)}
        />
      )}
    </S.CanvasContainer>
  );
};

export default Canvas;
