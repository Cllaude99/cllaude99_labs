import { useEffect, useRef } from 'react';

import { LINE_TEXT_GAP_WIDTH } from './RoughShape';
import * as S from './TextEditor.styles';
import { Shape, Viewport } from '../../types';
import { canvasToScreen } from '../../utils/coordinates';

interface TextEditorProps {
  shape: Shape;
  viewport: Viewport;
  stageSize: { width: number; height: number };
  themeMode: 'light' | 'dark';
  onSave: (text: string) => void;
  onCancel: () => void;
}

const TextEditor = ({
  shape,
  viewport,
  stageSize,
  themeMode,
  onSave,
  onCancel,
}: TextEditorProps) => {
  const editorRef = useRef<HTMLDivElement>(null);

  // 도형 중앙 좌표 계산
  let centerX: number, centerY: number;

  if ((shape.type === 'line' || shape.type === 'arrow') && shape.points) {
    const [x1, y1, x2, y2] = shape.points;
    centerX = shape.x + (x1 + x2) / 2;
    centerY = shape.y + (y1 + y2) / 2;
  } else {
    centerX = shape.x + shape.width / 2;
    centerY = shape.y + shape.height / 2;
  }

  const { x: screenX, y: screenY } = canvasToScreen(
    centerX,
    centerY,
    viewport,
    stageSize.width,
    stageSize.height,
  );

  // 자동 포커스 및 기존 텍스트 설정
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerText = shape.text || '';
      editorRef.current.focus();

      // 텍스트가 있으면 커서를 끝으로 이동
      if (shape.text) {
        const range = document.createRange();
        range.selectNodeContents(editorRef.current);
        range.collapse(false); // false = 끝으로 이동
        const selection = window.getSelection();
        selection?.removeAllRanges();
        selection?.addRange(range);
      }
    }
  }, [shape.text]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    e.stopPropagation(); // Canvas 단축키 충돌 방지

    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const text = editorRef.current?.innerText || '';
      onSave(text.trim());
    }
    if (e.key === 'Escape') {
      e.preventDefault();
      onCancel();
    }
  };

  const handleBlur = () => {
    const text = editorRef.current?.innerText || '';
    onSave(text.trim());
  };

  const isLineOrArrow = shape.type === 'line' || shape.type === 'arrow';

  // RoughShape와 동일하게 충분히 큰 높이 설정하여 verticalAlign 효과 모방
  const maxTextHeight = 500;

  return (
    <S.EditorWrapper
      style={{
        left: screenX,
        top: screenY,
        width: isLineOrArrow
          ? LINE_TEXT_GAP_WIDTH * viewport.zoom
          : shape.width * viewport.zoom,
        height: isLineOrArrow ? maxTextHeight * viewport.zoom : shape.height * viewport.zoom,
        transform: `translate(-50%, -50%) rotate(${shape.rotation || 0}deg)`,
      }}
    >
      <S.EditableDiv
        ref={editorRef}
        contentEditable
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        themeMode={themeMode}
        fontSize={(shape.fontSize || 16) * viewport.zoom}
        suppressContentEditableWarning
        aria-label="도형 텍스트 입력"
      />
    </S.EditorWrapper>
  );
};

export default TextEditor;
