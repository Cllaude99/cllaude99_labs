import styled from '@emotion/styled';
import { motion } from 'motion/react';

import { mq } from '@cllaude99/ui/breakpoints';
import { palette } from '@cllaude99/ui/palette';
import { typography } from '@cllaude99/ui/typography';

const PlanetSystemZIndex = 1;
const ProjectInfoZIndex = 10;
const ProjectInfoMaxWidth = `550px;`;

const Background = styled.div`
  position: absolute;
  inset: 0;
  background-image:
    radial-gradient(
      ellipse 800px 600px at 50% 200px,
      rgba(59, 130, 246, 0.15),
      transparent
    ),
    radial-gradient(
      ellipse 600px 400px at 80% 70%,
      rgba(147, 51, 234, 0.1),
      transparent
    ),
    linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
  background-size:
    100% 100%,
    100% 100%,
    64px 64px,
    64px 64px;
  mask-image: radial-gradient(
    ellipse 80% 50% at 50% 50%,
    #000 10%,
    transparent 100%
  );
  pointer-events: none;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 30px 12px 20px;
  min-height: 100vh;

  ${mq.tablet} {
    padding: 40px 16px 30px;
  }

  ${mq.desktop} {
    padding: 60px 24px 40px;
  }
`;

const Header = styled(motion.div)`
  position: absolute;
  top: 30px;
  inset-inline: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;

  ${mq.tablet} {
    top: 40px;
    gap: 10px;
  }

  ${mq.desktop} {
    top: 60px;
    gap: 16px;
  }
`;

const Title = styled.h1`
  ${typography.display3};
  color: ${palette.white};
  background: linear-gradient(to right, ${palette.white}, ${palette.grey400});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  ${mq.tablet} {
    ${typography.display1};
  }
`;

const Subtitle = styled.p`
  ${typography.title3};
  color: ${palette.grey500};

  ${mq.tablet} {
    ${typography.title2};
  }
`;

const PlanetSystem = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  z-index: ${PlanetSystemZIndex};
  pointer-events: none;
`;

const ProjectInfo = styled(motion.div)`
  position: relative;
  width: 100%;
  max-width: ${ProjectInfoMaxWidth};
  z-index: ${ProjectInfoZIndex};
  margin: 0 auto;
  background: linear-gradient(
    135deg,
    rgba(15, 15, 20, 0.65) 0%,
    rgba(10, 10, 15, 0.55) 100%
  );
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 16px;
  padding: 18px 20px;
  text-align: center;
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.25),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  pointer-events: auto;

  ${mq.tablet} {
    padding: 20px 24px;
  }
`;

const ProjectTitle = styled.h2`
  ${typography.display3};
  color: ${palette.white};
  margin: 0 0 10px;

  ${mq.tablet} {
    ${typography.display2};
  }
`;

const ProjectDescription = styled.p`
  ${typography.label2};
  color: ${palette.grey300};
  margin: 0 0 20px;

  ${mq.tablet} {
    ${typography.title3};
  }
`;

const TechStackWrapper = styled.div`
  display: flex;
  flex-wrap: nowrap;
  overflow-x: auto;
  justify-content: center;
  gap: 8px;
  margin-bottom: 20px;
  padding: 4px 0;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  -ms-overflow-style: none;
  touch-action: pan-x;

  ${mq.desktop} {
    flex-wrap: wrap;
    overflow-x: visible;
  }
`;

const TechBadge = styled.span`
  ${typography.label2};
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: ${palette.grey200};
  padding: 5px 10px;
  border-radius: 6px;
  backdrop-filter: blur(10px);
  transition: all 0.2s ease;
  white-space: nowrap;
  flex-shrink: 0;
  font-size: 12px;
  user-select: none;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
    border-color: rgba(255, 255, 255, 0.3);
  }

  ${mq.tablet} {
    padding: 8px 16px;
    font-size: 14px;
    border-radius: 8px;
  }
`;

const StartButton = styled(motion.button)`
  ${typography.body3Bold};
  opacity: 0.6;
  width: 100%;
  color: ${palette.white};
  padding-top: 18px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    text-decoration: underline;
    opacity: 1;
  }

  ${mq.tablet} {
    ${typography.title2};
  }
`;

export {
  Background,
  Content,
  Header,
  Title,
  Subtitle,
  PlanetSystem,
  ProjectInfo,
  ProjectTitle,
  ProjectDescription,
  TechStackWrapper,
  TechBadge,
  StartButton,
};
