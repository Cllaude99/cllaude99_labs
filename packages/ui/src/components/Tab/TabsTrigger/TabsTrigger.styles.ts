import styled from '@emotion/styled';
import { motion } from 'motion/react';

const Button = styled.button<{ isActive: boolean }>`
  position: relative;
  padding: 12px 16px;
  ${({ theme }) => theme.typography.body2Bold.styles};
  color: ${({ isActive, theme }) =>
    isActive ? theme.palette.blue500 : theme.palette.grey500};
  background: transparent;
  border: none;
  cursor: pointer;
  transition: color 0.2s ease;
  white-space: nowrap;
  margin-bottom: -1px;

  &:hover {
    color: ${({ theme }) => theme.palette.blue600};
  }

  &:focus {
    outline: none;
  }
`;

const ActiveIndicator = styled(motion.div)`
  position: absolute;
  bottom: -0.5px;
  left: 0;
  right: 0;
  height: 2px;
  background-color: ${({ theme }) => theme.palette.blue500};
  z-index: 1;
`;

const TabTriggerContent = styled.span`
  position: relative;
  z-index: 2;
`;

export { Button, ActiveIndicator, TabTriggerContent };
