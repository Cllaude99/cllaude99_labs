import {
  HTMLAttributes,
  ReactNode,
  createContext,
  useContext,
  useMemo,
} from 'react';
import { Group } from 'react-resizable-panels';
import type { Layout } from 'react-resizable-panels';

import * as S from './Resizable.styles';
import type { ResizableOrientation } from './types';

export interface ResizableRootProps extends HTMLAttributes<HTMLDivElement> {
  orientation: ResizableOrientation;
  autoSaveId?: string;
  onLayoutChange?: (layout: Layout) => void;
  children: ReactNode;
}

interface ResizableContextValue {
  orientation: ResizableOrientation;
}

const ResizableContext = createContext<ResizableContextValue>({
  orientation: 'horizontal',
});

export const useResizableContext = () => useContext(ResizableContext);

const ResizableRoot = ({
  orientation,
  autoSaveId,
  onLayoutChange,
  children,
  ...rest
}: ResizableRootProps) => {
  const contextValue = useMemo(() => ({ orientation }), [orientation]);

  return (
    <ResizableContext.Provider value={contextValue}>
      <S.Container {...rest}>
        <Group
          orientation={orientation}
          id={autoSaveId}
          onLayoutChange={onLayoutChange}
        >
          {children}
        </Group>
      </S.Container>
    </ResizableContext.Provider>
  );
};

export default ResizableRoot;
