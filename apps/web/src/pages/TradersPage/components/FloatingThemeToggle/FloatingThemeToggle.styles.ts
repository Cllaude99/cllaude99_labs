import styled from '@emotion/styled';

import { mq } from '@cllaude99/ui/design-system/breakpoints';

export const ToggleButton = styled.button`
  position: fixed;
  bottom: 20px;
  right: 16px;
  z-index: 50;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.traders.borderSecondary};
  background-color: ${({ theme }) => `${theme.traders.bgSecondary}cc`};
  color: ${({ theme }) => theme.traders.textSecondary};
  display: none;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  backdrop-filter: blur(8px);

  ${mq.tablet} {
    display: flex;
  }

  &:hover {
    border-color: ${({ theme }) => theme.traders.borderPrimary};
    color: ${({ theme }) => theme.traders.textPrimary};
    background-color: ${({ theme }) => theme.traders.bgSecondary};
  }
`;
