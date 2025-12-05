import { Minus, Plus, Redo2, Undo2 } from 'lucide-react';

import * as S from './ZoomControls.styles';
import { useSketchStore } from '../../stores/sketchStore';

const ZoomControls = () => {
  const { viewport, theme, zoomIn, zoomOut, resetZoom } = useSketchStore();

  const zoomPercentage = Math.round(viewport.zoom * 100);

  return (
    <S.ZoomControlsContainer themeMode={theme}>
      {/* Undo/Redo 버튼 (Sprint 1에서는 비활성화) */}
      <S.HistoryButtonGroup themeMode={theme}>
        <S.HistoryButton
          themeMode={theme}
          disabled
          aria-label="실행 취소"
          title="실행 취소 (Ctrl+Z) - 준비 중"
        >
          <Undo2 />
        </S.HistoryButton>
        <S.HistoryButton
          themeMode={theme}
          disabled
          aria-label="다시 실행"
          title="다시 실행 (Ctrl+Shift+Z) - 준비 중"
        >
          <Redo2 />
        </S.HistoryButton>
      </S.HistoryButtonGroup>

      {/* 줌 컨트롤 */}
      <S.ZoomButtonGroup themeMode={theme}>
        <S.ZoomButton
          themeMode={theme}
          onClick={zoomOut}
          disabled={viewport.zoom <= 0.1}
          aria-label="줌 아웃"
          title="줌 아웃"
        >
          <Minus />
        </S.ZoomButton>
        <S.ZoomLevel
          themeMode={theme}
          onClick={resetZoom}
          title="줌 리셋 (100%)"
        >
          {zoomPercentage}%
        </S.ZoomLevel>
        <S.ZoomButton
          themeMode={theme}
          onClick={zoomIn}
          disabled={viewport.zoom >= 5}
          aria-label="줌 인"
          title="줌 인"
        >
          <Plus />
        </S.ZoomButton>
      </S.ZoomButtonGroup>
    </S.ZoomControlsContainer>
  );
};

export default ZoomControls;
