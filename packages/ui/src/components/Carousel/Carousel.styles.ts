import styled from '@emotion/styled';

const DotsContainerZIndex = 100;

const Container = styled.div`
  position: relative;
  width: 100%;
  max-width: ${({ theme }) => theme.breakpoints.tablet};
`;

const BaseNavigationButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;

  width: 36px;
  height: 36px;
  border-radius: 50%;
  ${({ theme }) => theme.typography.title1};
  transition: all 0.3s ease;
  cursor: pointer;
  opacity: 0.7;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.9);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

  &:hover {
    opacity: 1;
    background: rgba(255, 255, 255, 0.15);
    border-color: rgba(255, 255, 255, 0.3);
    transform: translateY(-50%) scale(1.05);
  }

  &:active {
    transform: translateY(-50%) scale(0.95);
  }

  ${({ theme }) => theme.mq.tablet} {
    width: 48px;
    height: 48px;
  }
`;

const PrevButton = styled(BaseNavigationButton)`
  left: -8px;

  ${({ theme }) => theme.mq.tablet} {
    left: 10px;
  }
`;

const NextButton = styled(BaseNavigationButton)`
  right: -8px;

  ${({ theme }) => theme.mq.tablet} {
    right: 10px;
  }
`;

const DotsContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-top: 24px;
  z-index: ${DotsContainerZIndex};
  pointer-events: auto;
`;

const Dot = styled.button<{ isActive: boolean }>`
  width: ${({ isActive }) => (isActive ? '28px' : '10px')};
  height: 10px;
  border-radius: 6px;
  background: ${({ isActive }) =>
    isActive ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.3)'};

  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: ${({ isActive }) =>
      isActive ? 'rgba(255, 255, 255, 1)' : 'rgba(255, 255, 255, 0.5)'};
  }

  ${({ theme }) => theme.mq.tablet} {
    width: ${({ isActive }) => (isActive ? '32px' : '12px')};
    height: 12px;
  }
`;

export { Container, PrevButton, NextButton, DotsContainer, Dot };
