import styled from '@emotion/styled';

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
  padding: 20px;
`;

const Dialog = styled.div`
  width: 100%;
  max-width: 380px;
  background-color: ${({ theme }) => theme.palette.white};
  border-radius: 16px;
  border: 1px solid ${({ theme }) => theme.palette.grey150};
  padding: 32px 24px 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const StepContent = styled.div`
  text-align: center;
  min-height: 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
`;

const StepTitle = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.palette.grey900};
`;

const StepDescription = styled.p`
  font-size: 15px;
  color: ${({ theme }) => theme.palette.grey600};
  line-height: 1.6;
`;

const StepIndicator = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
`;

const Dot = styled.div<{ active: boolean }>`
  width: ${({ active }) => (active ? '20px' : '8px')};
  height: 8px;
  border-radius: 4px;
  background-color: ${({ theme, active }) => (active ? theme.palette.blue500 : theme.palette.grey200)};
  transition: all 0.3s;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
`;

const PrevButton = styled.button`
  flex: 1;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.palette.grey200};
  background-color: transparent;
  color: ${({ theme }) => theme.palette.grey600};
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.palette.grey50};
  }
`;

const NextButton = styled.button`
  flex: 2;
  padding: 12px;
  border-radius: 8px;
  border: none;
  background-color: ${({ theme }) => theme.palette.blue500};
  color: ${({ theme }) => theme.palette.white};
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }
`;

export {
  Overlay,
  Dialog,
  StepContent,
  StepTitle,
  StepDescription,
  StepIndicator,
  Dot,
  ButtonGroup,
  PrevButton,
  NextButton,
};
