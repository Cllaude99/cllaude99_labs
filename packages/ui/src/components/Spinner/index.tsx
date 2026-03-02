import { HTMLAttributes } from 'react';

import * as S from './Spinner.styles';
import { SpinnerSize, SpinnerVariant } from './Spinner.styles';

export interface SpinnerProps extends HTMLAttributes<HTMLDivElement> {
  size?: SpinnerSize;
  variant?: SpinnerVariant;
  thickness?: number;
  speed?: number;
  label?: string;
}

const Spinner = ({
  size = 'medium',
  variant = 'primary',
  thickness = 4,
  speed = 1,
  label = '로딩중',
  ...rest
}: SpinnerProps) => {
  return (
    <S.SpinnerContainer size={size} role="status" aria-label={label} {...rest}>
      <S.SpinnerSVG viewBox="0 0 50 50" speed={speed}>
        <S.SpinnerCircle
          cx="25"
          cy="25"
          r="20"
          variant={variant}
          thickness={thickness}
        />
      </S.SpinnerSVG>
    </S.SpinnerContainer>
  );
};

export default Spinner;
