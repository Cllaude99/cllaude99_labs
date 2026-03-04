import { CSSProperties } from 'react';
import { Separator } from 'react-resizable-panels';

import { useResizableContext } from '..';
import * as S from './ResizableHandle.styles';

export interface ResizableHandleProps {
  withHandle?: boolean;
  dotCount?: number;
  disabled?: boolean;
  className?: string;
  style?: CSSProperties;
}

const DEFAULT_DOT_COUNT = 6;

const ResizableHandle = ({
  withHandle = false,
  dotCount = DEFAULT_DOT_COUNT,
  disabled = false,
  className,
  style,
}: ResizableHandleProps) => {
  const { orientation } = useResizableContext();

  return (
    <Separator disabled={disabled} className={className} style={style}>
      <S.Container orientation={orientation}>
        {withHandle && (
          <S.GripIcon orientation={orientation}>
            {Array.from({ length: dotCount }, (_, i) => (
              <S.GripDot key={i} />
            ))}
          </S.GripIcon>
        )}
      </S.Container>
    </Separator>
  );
};

export default ResizableHandle;
