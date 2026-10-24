import styled from '@emotion/styled';
import { motion } from 'motion/react';

import { mq } from '@cllaude99/ui/design-system/breakpoints';
import { palette } from '@cllaude99/ui/design-system/palette';
import { typography } from '@cllaude99/ui/design-system/typography';

const QuickStatsZIndex = 20;

export const Container = styled(motion.div)`
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: ${QuickStatsZIndex};
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 10px 12px;
  min-width: 140px;
  background: linear-gradient(
    135deg,
    rgba(15, 15, 20, 0.65) 0%,
    rgba(10, 10, 15, 0.55) 100%
  );
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.25),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  pointer-events: none;
  user-select: none;

  ${mq.tablet} {
    gap: 6px;
    padding: 14px 18px;
    min-width: 200px;
    border-radius: 16px;
  }
`;

export const Time = styled.div`
  ${typography.label1Bold};
  color: ${palette.white};
  font-variant-numeric: tabular-nums;
  font-size: 14px;

  ${mq.tablet} {
    ${typography.heading4};
    font-variant-numeric: tabular-nums;
  }
`;

export const Date = styled.div`
  ${typography.caption1};
  color: ${palette.grey300};
  font-size: 11px;

  ${mq.tablet} {
    ${typography.label2};
  }
`;

export const ProjectCount = styled.div`
  ${typography.caption1};
  color: ${palette.grey400};
  font-size: 11px;

  ${mq.tablet} {
    ${typography.label2};
  }
`;
