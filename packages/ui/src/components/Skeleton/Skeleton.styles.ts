import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
`;

export type SkeletonVariant = 'rectangular' | 'rounded' | 'circular';

export interface SkeletonStyleProps {
  variant?: SkeletonVariant;
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
}

export const SkeletonContainer = styled.div<SkeletonStyleProps>`
  background-color: ${({ theme }) => theme.palette.grey200};
  animation: ${pulse} 1.5s ease-in-out infinite;

  width: ${({ width }) =>
    typeof width === 'number' ? `${width}px` : width || '100%'};
  height: ${({ height }) =>
    typeof height === 'number' ? `${height}px` : height || '16px'};

  ${({ variant = 'rectangular', borderRadius }) => {
    if (borderRadius !== undefined) {
      return `border-radius: ${typeof borderRadius === 'number' ? `${borderRadius}px` : borderRadius};`;
    }

    switch (variant) {
      case 'rectangular':
        return `border-radius: 4px;`;
      case 'rounded':
        return `border-radius: 8px;`;
      case 'circular':
        return `border-radius: 50%;`;
      default:
        return `border-radius: 4px;`;
    }
  }}

  /* 사용자 운영체제 설정에 따라 애니메이션 비활성화 */
  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;
