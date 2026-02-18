import styled from '@emotion/styled';

const ActionLog = styled.div`
  margin-top: 12px;
  padding: 12px;
  font-size: 13px;
  font-family: 'Fira Code', monospace;
  color: #374151;
  background-color: #f3f4f6;
  border-radius: 8px;
  min-height: 40px;
  display: flex;
  align-items: center;
`;

const ChallengeSection = styled.section`
  margin-top: 48px;
  padding: 24px;
  background-color: #fefce8;
  border: 1px solid #fde68a;
  border-radius: 12px;
`;

const ChallengeTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: #92400e;
  margin-bottom: 8px;
`;

const ChallengeGuide = styled.p`
  font-size: 14px;
  color: #78350f;
  line-height: 1.6;
  margin-bottom: 12px;
`;

const ChallengeSteps = styled.ol`
  font-size: 13px;
  color: #78350f;
  line-height: 1.8;
  margin: 0 0 20px;
  padding-left: 20px;

  li {
    margin-bottom: 4px;
  }
`;

const ChallengeDescription = styled.p`
  font-size: 14px;
  color: #78350f;
  line-height: 1.6;
  margin-bottom: 20px;
`;

const ChallengeButtonRow = styled.div<{ hideFocus: boolean }>`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  pointer-events: none;

  ${({ hideFocus }) =>
    hideFocus &&
    `
    button:focus,
    button:focus-visible {
      outline: none !important;
      box-shadow: none !important;
    }
  `}
`;

const ChallengeButton = styled.button`
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  background-color: #ffffff;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  cursor: pointer;
  pointer-events: auto;

  &:hover {
    background-color: #f9fafb;
  }

  &:focus-visible {
    outline: 2px solid #3182f6;
    outline-offset: 2px;
  }
`;

const ChallengeControls = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 16px;
`;

const StartButton = styled.button`
  padding: 8px 20px;
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
  background-color: #92400e;
  border: none;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background-color: #78350f;
  }

  &:focus-visible {
    outline: 2px solid #92400e;
    outline-offset: 2px;
  }
`;

const FocusToggle = styled.span`
  font-size: 13px;
  color: #78350f;
`;

export {
  ActionLog,
  ChallengeSection,
  ChallengeTitle,
  ChallengeGuide,
  ChallengeSteps,
  ChallengeDescription,
  ChallengeButtonRow,
  ChallengeButton,
  ChallengeControls,
  StartButton,
  FocusToggle,
};
