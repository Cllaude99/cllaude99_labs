import { useState } from 'react';

import { AnimatePresence } from 'motion/react';

import * as S from './PlanetNav.styles';

interface Project {
  id: number;
  title: string;
  description: string;
  path: string;
  techStack: string[];
}

interface PlanetNavProps {
  currentIndex: number;
  projects: Project[];
  onIndexChange: (index: number) => void;
}

const DOT_SPRING = { type: 'spring' as const, stiffness: 400, damping: 28 };
const ACTIVE_SCALE = 1.6;

const PlanetNav = ({
  currentIndex,
  projects,
  onIndexChange,
}: PlanetNavProps) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <S.Nav aria-label="프로젝트 네비게이션">
      {projects.map((project, index) => {
        const isActive = index === currentIndex;
        const isTooltipVisible = hoveredIndex === index;

        return (
          <S.DotWrapper
            key={project.id}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <S.Dot
              type="button"
              isActive={isActive}
              animate={{ scale: isActive ? ACTIVE_SCALE : 1 }}
              transition={DOT_SPRING}
              onClick={() => onIndexChange(index)}
              onFocus={() => setHoveredIndex(index)}
              onBlur={() => setHoveredIndex(null)}
              aria-label={`${project.title} 프로젝트로 이동`}
              aria-current={isActive ? 'true' : undefined}
            />
            <AnimatePresence>
              {isTooltipVisible && (
                <S.Tooltip
                  role="tooltip"
                  initial={{ opacity: 0, x: 6 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 6 }}
                  transition={{ duration: 0.18 }}
                >
                  {project.title}
                </S.Tooltip>
              )}
            </AnimatePresence>
          </S.DotWrapper>
        );
      })}
    </S.Nav>
  );
};

export default PlanetNav;
