import { useEffect, useMemo, useState } from 'react';

import { Terminal } from 'lucide-react';
import { AnimatePresence } from 'motion/react';

import { useDialog } from '@cllaude99/ui';

import { PATH } from '@/constants';

import { DOCK_ITEMS } from './constants';
import * as S from './Dock.styles';
import DockItem from './DockItem';
import { useDockPosition, useMinimizedTerminal } from './hooks';
import ProjectsContent from './ProjectsModal';
import TerminalContent from './TerminalModal';

const Dock = () => {
  const { openDialog } = useDialog();
  const { position, togglePosition } = useDockPosition();
  const [currentPosition, setCurrentPosition] = useState(position);
  const { isTerminalMinimized, minimizeTerminal, restoreTerminal } =
    useMinimizedTerminal();
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  /* 위치 변경 시 사라졌다가 등장하는 애니메이션 */
  useEffect(() => {
    if (position === currentPosition) return;

    setIsVisible(false);
    const timer = setTimeout(() => {
      setCurrentPosition(position);
      setIsVisible(true);
    }, 300);

    return () => clearTimeout(timer);
  }, [position, currentPosition]);

  const variants = useMemo(() => {
    if (currentPosition === 'bottom') {
      return {
        initial: { y: 100, opacity: 0 },
        animate: { y: 0, opacity: 1 },
        exit: { y: 100, opacity: 0 },
      };
    }
    return {
      initial: { x: -100, opacity: 0 },
      animate: { x: 0, opacity: 1 },
      exit: { x: -100, opacity: 0 },
    };
  }, [currentPosition]);

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <S.DockContainer
          key={currentPosition}
          position={currentPosition}
          isHovered={isHovered}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          initial={variants.initial}
          animate={variants.animate}
          exit={variants.exit}
          transition={{ type: 'tween', stiffness: 400, damping: 30 }}
        >
          {DOCK_ITEMS.map((item) => (
            <DockItem
              key={item.id}
              icon={item.icon}
              label={item.label}
              onClick={() => {
                switch (item.id) {
                  case 'home':
                    window.location.href = PATH.ROOT;
                    break;
                  case 'projects':
                    openDialog({ content: <ProjectsContent /> });
                    break;
                  case 'blog':
                    window.location.href = 'https://www.cllaude99.com/';
                    break;
                  case 'terminal':
                    openDialog({
                      content: (
                        <TerminalContent
                          onMinimize={minimizeTerminal}
                          dockPosition={currentPosition}
                        />
                      ),
                    });
                    break;
                  case 'dock-position':
                    togglePosition();
                    break;
                }
              }}
            />
          ))}

          {/* 최소화된 터미널 */}
          {isTerminalMinimized && (
            <>
              <S.Divider position={currentPosition} />
              <DockItem
                icon={<Terminal />}
                label="터미널"
                onClick={() => {
                  restoreTerminal();
                  openDialog({
                    content: (
                      <TerminalContent
                        onMinimize={minimizeTerminal}
                        dockPosition={currentPosition}
                      />
                    ),
                  });
                }}
                isMinimized={true}
              />
            </>
          )}
        </S.DockContainer>
      )}
    </AnimatePresence>
  );
};

export default Dock;
