import { useState, useRef, useEffect } from 'react';

import * as S from './ColorPicker.styles';
import { FILL_COLORS, STROKE_COLORS } from '../../constants/colors';
import { ThemeMode } from '../../types';

interface ColorPickerProps {
  type: 'fill' | 'stroke';
  currentColor: string;
  onChange: (color: string) => void;
  themeMode: ThemeMode;
}

const ColorPicker = ({
  type,
  currentColor,
  onChange,
  themeMode,
}: ColorPickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const colors = type === 'fill' ? FILL_COLORS : STROKE_COLORS;

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    // isOpen일 때만 리스너 추가
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <S.ColorPickerWrapper ref={wrapperRef}>
      {/* 현재 색상 버튼 */}
      <S.CurrentColorButton
        color={currentColor}
        onClick={() => setIsOpen(!isOpen)}
        themeMode={themeMode}
        aria-label={`${type} 색상 선택`}
      >
        <S.ColorPreview color={currentColor} />
      </S.CurrentColorButton>

      {/* 드롭다운 팔레트 */}
      {isOpen && (
        <S.ColorPalette themeMode={themeMode}>
          {colors.map((color, index) => (
            <S.ColorOption
              key={color.value}
              color={color.value}
              isSelected={currentColor === color.value}
              themeMode={themeMode}
              onClick={() => {
                onChange(color.value);
                setIsOpen(false);
              }}
              aria-label={`${color.name} 색상 선택 (단축키: ${index + 1})`}
            />
          ))}
        </S.ColorPalette>
      )}
    </S.ColorPickerWrapper>
  );
};

export default ColorPicker;
