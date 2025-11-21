import { Suspense, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { AnimatePresence } from 'motion/react';

import { PATH } from '@/constants';

import PlanetScene from './components/PlanetScene';
import * as S from './HomePage.styles';

interface Project {
  id: number;
  title: string;
  description: string;
  path: string;
  techStack: string[];
}

const projects: Project[] = [
  {
    id: 0,
    title: 'Sketch',
    description: '실시간 협업이 가능한 캔버스',
    path: PATH.SKETCH,
    techStack: ['React-Konva', 'Liveblocks', 'CRDT', 'rough.js'],
  },
  {
    id: 1,
    title: 'Traders',
    description:
      '과거로 돌아가 주식 투자를 다시 해보는\n실시간 시뮬레이션 게임',
    path: PATH.TRADERS,
    techStack: ['React', 'Supabase', 'Lightweight Charts', 'WebSocket'],
  },
];

const HomePage = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const currentProject = projects[currentIndex];

  const handleNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);

    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % projects.length);
      setIsTransitioning(false);
    }, 400);
  };

  const handlePlanetClick = (index: number) => {
    if (isTransitioning || index === currentIndex) return;
    setIsTransitioning(true);

    setTimeout(() => {
      setCurrentIndex(index);
      setIsTransitioning(false);
    }, 400);
  };

  const handleVisitService = () => {
    navigate(currentProject.path);
  };

  return (
    <S.Container>
      <S.BackgroundGrid />
      <S.GradientOverlay />
      <S.Content>
        <S.Header
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <S.Title>Cllaude99_Labs</S.Title>
          <S.Subtitle>관심있는 것을 실험해보는 공간</S.Subtitle>
        </S.Header>

        {/* 3D 행성 시스템 (Three.js) */}
        <S.PlanetSystem>
          <Suspense fallback={null}>
            <PlanetScene
              currentIndex={currentIndex}
              totalProjects={projects.length}
              onPlanetClick={handlePlanetClick}
            />
          </Suspense>
        </S.PlanetSystem>

        {/* 프로젝트 정보 */}
        <AnimatePresence mode="wait">
          <S.ProjectInfo
            key={currentIndex}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{
              duration: 0.4,
              ease: [0.25, 0.1, 0.25, 1],
            }}
          >
            <S.ProjectTitle>{currentProject.title}</S.ProjectTitle>
            <S.ProjectDescription>
              {currentProject.description}
            </S.ProjectDescription>

            <S.TechStackWrapper>
              {currentProject.techStack.map((tech) => (
                <S.TechBadge key={tech}>{tech}</S.TechBadge>
              ))}
            </S.TechStackWrapper>

            <S.StartButton
              onClick={handleVisitService}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              서비스 보러가기
              <S.ArrowIcon>→</S.ArrowIcon>
            </S.StartButton>
          </S.ProjectInfo>
        </AnimatePresence>

        {/* 컨트롤 */}
        <S.Controls>
          <S.NavigationButton
            onClick={handleNext}
            disabled={isTransitioning}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            다음 프로젝트 →
          </S.NavigationButton>

          <S.Indicators>
            {projects.map((_, index) => (
              <S.Indicator
                key={index}
                isActive={index === currentIndex}
                onClick={() => handlePlanetClick(index)}
              />
            ))}
          </S.Indicators>
        </S.Controls>

        {/* 푸터 */}
        <S.Footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <S.FooterText>
            © 2025 Cllaude99_Labs. All rights reserved.
          </S.FooterText>
        </S.Footer>
      </S.Content>
    </S.Container>
  );
};

export default HomePage;
