import { useRef } from 'react';

import { useMotionValue } from 'motion/react';

import * as S from './DockItem.styles';
import { useMagnification } from '../../hooks';

interface DockItemProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  isMinimized?: boolean;
}

const DockItem = ({ icon, label, onClick, isMinimized }: DockItemProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(Infinity);
  const { scale } = useMagnification(ref, mouseX);

  return (
    <S.ItemContainer
      ref={ref}
      onClick={onClick}
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      role="button"
      aria-label={label}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick();
        }
      }}
    >
      <S.IconWrapper
        style={{ scale }}
        whileHover={{ y: -2, background: 'rgba(255, 255, 255, 0.15)' }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: 'tween', stiffness: 400, damping: 30 }}
      >
        {icon}
      </S.IconWrapper>
      {isMinimized && <S.MinimizedDot />}
      <S.Tooltip>{label}</S.Tooltip>
    </S.ItemContainer>
  );
};

export default DockItem;
