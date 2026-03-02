import { HTMLAttributes } from 'react';

import * as S from './Skeleton.styles';

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: S.SkeletonVariant;
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
}

const Skeleton = ({
  variant = 'rectangular',
  width,
  height,
  borderRadius,
  ...rest
}: SkeletonProps) => {
  return (
    <S.SkeletonContainer
      variant={variant}
      width={width}
      height={height}
      borderRadius={borderRadius}
      {...rest}
    />
  );
};

export default Skeleton;
