import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

export type SpinnerSize = 'small' | 'medium' | 'large';
export type SpinnerVariant = 'primary' | 'secondary' | 'inherit';

export interface SpinnerStyleProps {
  size?: SpinnerSize;
  variant?: SpinnerVariant;
  thickness?: number;
  speed?: number;
}

const SpinnerContainer = styled.div<SpinnerStyleProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;

  ${({ size = 'medium' }) => {
    switch (size) {
      case 'small':
        return `
          width: 16px;
          height: 16px;
        `;
      case 'medium':
        return `
          width: 24px;
          height: 24px;
        `;
      case 'large':
        return `
          width: 40px;
          height: 40px;
        `;
    }
  }}
`;

const SpinnerSVG = styled.svg<SpinnerStyleProps>`
  animation: ${spin} ${({ speed = 1 }) => 0.8 / speed}s linear infinite;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

const SpinnerCircle = styled.circle<SpinnerStyleProps>`
  fill: none;
  stroke-linecap: round;
  stroke-dasharray: 80px, 200px;
  stroke-dashoffset: 0;

  ${({ variant = 'primary', theme, thickness = 4 }) => {
    switch (variant) {
      case 'primary':
        return `
          stroke: ${theme.palette.blue500};
          stroke-width: ${thickness}px;
        `;
      case 'secondary':
        return `
          stroke: ${theme.palette.grey600};
          stroke-width: ${thickness}px;
        `;
      case 'inherit':
        return `
          stroke: currentColor;
          stroke-width: ${thickness}px;
        `;
      default:
        return `
          stroke: ${theme.palette.blue500};
          stroke-width: ${thickness}px;
        `;
    }
  }}
`;

export { SpinnerContainer, SpinnerSVG, SpinnerCircle };
