import styled from '@emotion/styled';
import { motion } from 'motion/react';

const ItemContainer = styled.div`
  position: relative;
  cursor: pointer;
  outline: none;

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.palette.blue500};
    outline-offset: 2px;
    border-radius: 10px;
  }
`;

const IconWrapper = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.08);
  color: ${({ theme }) => theme.palette.white};
  will-change: transform;

  svg {
    width: 18px;
    height: 18px;
  }
`;

const MinimizedDot = styled.div`
  position: absolute;
  bottom: -6px;
  left: 50%;
  transform: translateX(-50%);
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: ${({ theme }) => theme.palette.white};
  opacity: 0.8;
`;

const Tooltip = styled.div`
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  padding: 4px 10px;
  margin-bottom: 6px;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(8px);
  color: ${({ theme }) => theme.palette.white};
  ${({ theme }) => theme.typography.label3};
  border-radius: 5px;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.15s ease;
  border: 1px solid rgba(255, 255, 255, 0.1);

  ${ItemContainer}:hover & {
    opacity: 1;
  }
`;

export { ItemContainer, IconWrapper, MinimizedDot, Tooltip };
