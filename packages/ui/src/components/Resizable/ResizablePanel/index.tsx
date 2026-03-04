import { ReactNode } from 'react';
import { Panel } from 'react-resizable-panels';
import type { PanelSize } from 'react-resizable-panels';

import * as S from './ResizablePanel.styles';

export interface ResizablePanelProps {
  id?: string;
  defaultSize?: number | string;
  minSize?: number | string;
  maxSize?: number | string;
  collapsible?: boolean;
  collapsedSize?: number | string;
  onResize?: (
    panelSize: PanelSize,
    id: string | number | undefined,
    prevPanelSize: PanelSize | undefined,
  ) => void;
  children: ReactNode;
}

const ResizablePanel = ({
  id,
  defaultSize,
  minSize,
  maxSize,
  collapsible = false,
  collapsedSize,
  onResize,
  children,
}: ResizablePanelProps) => {
  return (
    <Panel
      id={id}
      defaultSize={defaultSize}
      minSize={minSize}
      maxSize={maxSize}
      collapsible={collapsible}
      collapsedSize={collapsedSize}
      onResize={onResize}
    >
      <S.Container>{children}</S.Container>
    </Panel>
  );
};

export default ResizablePanel;
