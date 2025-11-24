import { Suspense, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Carousel, Footer } from '@cllaude99/ui';

import Layout from '@/components/Layout';
import { PROJECTS } from '@/constants';

import PlanetScene from './components/PlanetScene';
import * as S from './HomePage.styles';

const HomePage = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <Layout
      layoutStyle={{
        background: '#0a0a0a',
      }}
    >
      <S.Background />
      <S.Content>
        <S.Header
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <S.Title>Cllaude99_Labs</S.Title>
          <S.Subtitle>관심있는 것을 실험해보는 공간</S.Subtitle>
        </S.Header>

        {/* 3D 행성 시스템 */}
        <S.PlanetSystem>
          <Suspense fallback={null}>
            <PlanetScene
              currentIndex={currentIndex}
              projectsLength={PROJECTS.length}
              onPlanetClick={(index) => {
                setCurrentIndex(index);
              }}
            />
          </Suspense>
        </S.PlanetSystem>

        {/* 프로젝트 소개 영역 */}
        <Carousel
          currentIndex={currentIndex}
          onIndexChange={(index) => setCurrentIndex(index)}
        >
          {PROJECTS.map((project) => (
            <S.ProjectInfo key={project.id}>
              <S.ProjectTitle>{project.title}</S.ProjectTitle>
              <S.ProjectDescription>{project.description}</S.ProjectDescription>

              <S.TechStackWrapper>
                {project.techStack.map((tech) => (
                  <S.TechBadge key={tech}>{tech}</S.TechBadge>
                ))}
              </S.TechStackWrapper>

              <S.StartButton
                onClick={() => navigate(project.path)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                서비스 보러가기 →
              </S.StartButton>
            </S.ProjectInfo>
          ))}
        </Carousel>
      </S.Content>
      <Footer />
    </Layout>
  );
};

export default HomePage;
