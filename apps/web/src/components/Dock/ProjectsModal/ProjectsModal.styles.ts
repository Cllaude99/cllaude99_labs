import styled from '@emotion/styled';

const Container = styled.div`
  width: 90vw;
  max-width: 520px;
  max-height: 70vh;
  overflow-y: auto;
  background: linear-gradient(
    135deg,
    rgba(15, 15, 20, 0.85) 0%,
    rgba(10, 10, 15, 0.75) 100%
  );
  backdrop-filter: blur(24px) saturate(180%);
  -webkit-backdrop-filter: blur(24px) saturate(180%);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.4),
    0 2px 8px rgba(0, 0, 0, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.08);
  padding: 20px;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.15);
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.25);
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
`;

const Title = styled.h2`
  ${({ theme }) => theme.typography.title2};
  color: ${({ theme }) => theme.palette.white};
  margin: 0;
  background: linear-gradient(
    to right,
    ${({ theme }) => theme.palette.white},
    ${({ theme }) => theme.palette.grey300}
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const CloseButton = styled.button`
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: ${({ theme }) => theme.palette.grey400};
  cursor: pointer;
  padding: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: all 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.palette.white};
    background: rgba(255, 255, 255, 0.12);
    border-color: rgba(255, 255, 255, 0.2);
  }
`;

const ProjectList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ProjectCard = styled.div`
  padding: 16px;
  background: rgba(255, 255, 255, 0.04);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(255, 255, 255, 0.06);

  &:hover {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(255, 255, 255, 0.15);
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  }
`;

const ProjectTitle = styled.h3`
  ${({ theme }) => theme.typography.title3};
  color: ${({ theme }) => theme.palette.white};
  margin: 0 0 6px 0;
`;

const ProjectDescription = styled.p`
  ${({ theme }) => theme.typography.body3};
  color: ${({ theme }) => theme.palette.grey400};
  margin: 0 0 12px 0;
  line-height: 1.5;
`;

const TechStack = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

const TechBadge = styled.span`
  ${({ theme }) => theme.typography.label3};
  padding: 3px 8px;
  background: rgba(255, 255, 255, 0.06);
  color: ${({ theme }) => theme.palette.grey300};
  border-radius: 4px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  font-size: 11px;
`;

export {
  Container,
  Header,
  Title,
  CloseButton,
  ProjectList,
  ProjectCard,
  ProjectTitle,
  ProjectDescription,
  TechStack,
  TechBadge,
};
