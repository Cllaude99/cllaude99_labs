import { useCallback, useEffect, useRef, useState } from 'react';
import { Layer, Rect, Stage, Transformer } from 'react-konva';

import Konva from 'konva';

import * as S from './Canvas.styles';
import RoughShape from './RoughShape';
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

  // Zustand에서 setTool과 deleteShape 가져오기
  const setTool = useSketchStore((state) => state.setTool);
  const deleteShape = useSketchStore((state) => state.deleteShape);

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

      if (e.code === 'Space' && !isSpacePressed) {
        e.preventDefault();
        setIsSpacePressed(true);
      }

      // 도구 단축키 (Ctrl/Cmd 없이) - e.code로 물리적 키 위치 감지 (한/영 모두 지원)
      if (!e.ctrlKey && !e.metaKey) {
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
  }, [isSpacePressed, setIsSpacePressed, setTool, deleteShape]);

  // Transformer 업데이트 (선택된 도형이 변경될 때)
  useEffect(() => {
    if (!transformerRef.current) return;

    const selectedNodes: Konva.Group[] = [];
    selectedShapeIds.forEach((id) => {
      const node = shapeRefs.current.get(id);
      if (node) {
        selectedNodes.push(node);
      }
    });

    transformerRef.current.nodes(selectedNodes);
    transformerRef.current.getLayer()?.batchDraw();
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

      // select 도구에서 빈 영역 드래그 시 선택 박스 시작
      if (tool === 'select' && e.target === stage) {
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

      const shapeLeft = shape.x;
      const shapeRight = shape.x + shape.width;
      const shapeTop = shape.y;
      const shapeBottom = shape.y + shape.height;

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

      updateShape(id, {
        x: node.x(),
        y: node.y(),
        width: Math.max(shape.width * scaleX, 10),
        height: Math.max(shape.height * scaleY, 10),
        rotation: node.rotation(),
      });
    });
  }, [selectedShapeIds, shapes, updateShape]);

  // 커서 스타일 결정
  const getCursorClass = (): string => {
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
      >
        {/* 도형 레이어 */}
        <Layer>
          {shapes.map((shape) => (
            <RoughShape
              key={shape.id}
              shape={shape}
              isDraggable={tool === 'select'}
              shapeRef={(node) => {
                if (node) {
                  shapeRefs.current.set(shape.id, node);
                } else {
                  shapeRefs.current.delete(shape.id);
                }
              }}
              onClick={() => handleShapeClick(shape.id)}
              onDragEnd={(x, y) => handleShapeDragEnd(shape.id, x, y)}
            />
          ))}

          {/* 그리는 중인 도형 */}
          {drawingState.isDrawing && drawingState.currentShape && (
            <RoughShape shape={drawingState.currentShape} />
          )}

          {/* Excalidraw 스타일 Transformer */}
          <Transformer
            ref={transformerRef}
            rotateEnabled={true}
            rotationSnaps={[0, 45, 90, 135, 180, 225, 270, 315]}
            rotateAnchorOffset={20}
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
            onTransformEnd={handleTransformEnd}
          />

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
    </S.CanvasContainer>
  );
};

export default Canvas;
