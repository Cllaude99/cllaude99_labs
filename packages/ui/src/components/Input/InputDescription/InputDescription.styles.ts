import styled from '@emotion/styled';

import type { InputStatus } from '../types';

export interface InputDescriptionStyleProps {
  status: InputStatus;
  disabled?: boolean;
}

const Description = styled.p<InputDescriptionStyleProps>`
  margin: 0;
  ${({ theme }) => theme.typography.caption1.styles};

  ${({ status, disabled, theme }) => {
    if (disabled) {
      return `color: ${theme.palette.grey300};`;
    }

    switch (status) {
      case 'error':
        return `color: ${theme.palette.red500};`;
      case 'success':
        return `color: ${theme.palette.green600};`;
      default:
        return `color: ${theme.palette.grey500};`;
    }
  }}
`;

export { Description };
