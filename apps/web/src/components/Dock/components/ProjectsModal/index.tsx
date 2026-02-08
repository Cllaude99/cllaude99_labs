import { X } from 'lucide-react';

import useDialog from '@cllaude99/ui/useDialog';

import { PROJECTS } from '@/constants';

import * as S from './ProjectsModal.styles';

const ProjectsContent = () => {
  const { closeDialog } = useDialog();

  return (
    <S.Container>
      <S.Header>
        <S.Title>프로젝트</S.Title>
        <S.CloseButton onClick={closeDialog} aria-label="닫기">
          <X size={18} />
        </S.CloseButton>
      </S.Header>

      <S.ProjectList>
        {PROJECTS.map((project) => (
          <S.ProjectCard
            key={project.id}
            onClick={() => {
              closeDialog();
              window.location.href = project.path;
            }}
          >
            <S.ProjectTitle>{project.title}</S.ProjectTitle>
            <S.ProjectDescription>{project.description}</S.ProjectDescription>
            <S.TechStack>
              {project.techStack.map((tech) => (
                <S.TechBadge key={tech}>{tech}</S.TechBadge>
              ))}
            </S.TechStack>
          </S.ProjectCard>
        ))}
      </S.ProjectList>
    </S.Container>
  );
};

export default ProjectsContent;
