import styled from '@emotion/styled';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'small' | 'medium' | 'large';

export interface ButtonStyleProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  icon?: React.ReactNode;
}

const ButtonContainer = styled.button<ButtonStyleProps>`
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  border-radius: 8px;
  transition: all 0.2s ease-in-out;
  cursor: pointer;
  font-family: inherit;
  white-space: nowrap;
  user-select: none;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  ${({ size = 'medium', theme }) => {
    switch (size) {
      case 'small':
        return `
          height: 40px;
          padding: 0 16px;
          gap: 6px;
          ${theme.typography.body2Bold.styles};
        `;
      case 'medium':
        return `
          height: 48px;
          padding: 0 20px;
          gap: 8px;
          ${theme.typography.body2Bold.styles};
        `;
      case 'large':
        return `
          height: 56px;
          padding: 0 24px;
          gap: 10px;
          ${theme.typography.title2.styles};
        `;
    }
  }}

  ${({ variant = 'primary', theme }) => {
    switch (variant) {
      case 'primary':
        return `
          color: ${theme.palette.white};
          background-color: ${theme.palette.blue500};

          &:hover:not(:disabled) {
            background-color: ${theme.palette.blue600};
            transform: translateY(-1px);
          }

          &:active:not(:disabled) {
            background-color: ${theme.palette.blue700};
            transform: translateY(0);
          }
        `;
      case 'secondary':
        return `
          color: ${theme.palette.blue500};
          background-color: ${theme.palette.blue50};

          &:hover:not(:disabled) {
            background-color: ${theme.palette.blue100};
            transform: translateY(-1px);
          }

          &:active:not(:disabled) {
            background-color: ${theme.palette.blue200};
            transform: translateY(0);
          }
        `;
      case 'outline':
        return `
          color: ${theme.palette.blue500};
          border: 1px solid ${theme.palette.grey200};
          background-color: transparent;

          &:hover:not(:disabled) {
            border: 1px solid ${theme.palette.blue500};
            color: ${theme.palette.blue500};
            background-color: ${theme.palette.blue50};
            transform: translateY(-1px);
          }

          &:active:not(:disabled) {
            border: 1px solid ${theme.palette.blue600};
            color: ${theme.palette.blue600};
            background-color: ${theme.palette.blue100};
            transform: translateY(0);
          }
        `;
      case 'ghost':
        return `
          color: ${theme.palette.blue500};
          background-color: transparent;

          &:hover:not(:disabled) {
            background-color: ${theme.palette.blue50};
          }

          &:active:not(:disabled) {
            background-color: ${theme.palette.blue100};
          }
        `;
      case 'danger':
        return `
          color: ${theme.palette.white};
          background-color: ${theme.palette.red500};

          &:hover:not(:disabled) {
            background-color: ${theme.palette.red600};
            transform: translateY(-1px);
          }

          &:active:not(:disabled) {
            background-color: ${theme.palette.red700};
            transform: translateY(0);
          }
        `;
    }
  }}
`;

const Icon = styled.div<Pick<ButtonStyleProps, 'size'> & { hasChildren: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  flex-shrink: 0;
`;

export { ButtonContainer, Icon };
