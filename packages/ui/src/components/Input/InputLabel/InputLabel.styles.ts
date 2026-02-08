import styled from '@emotion/styled';

import type { InputSize } from '../types';

export interface InputLabelStyleProps {
  inputSize: InputSize;
  disabled?: boolean;
}

const Label = styled.label<InputLabelStyleProps>`
  display: inline-flex;
  align-items: center;
  gap: 2px;
  margin: 0;
  color: ${({ disabled, theme }) =>
    disabled ? theme.palette.grey400 : theme.palette.grey700};

  ${({ inputSize, theme }) => {
    switch (inputSize) {
      case 'small':
        return theme.typography.label2Bold.styles;
      case 'medium':
        return theme.typography.label1Bold.styles;
      case 'large':
        return theme.typography.body2Bold.styles;
    }
  }}
`;

const RequiredMark = styled.span`
  color: ${({ theme }) => theme.palette.red500};
`;

export { Label, RequiredMark };
