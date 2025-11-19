import styled from '@emotion/styled';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger';
type ButtonSize = 'small' | 'medium' | 'large';

export interface ButtonProps {
  variant: ButtonVariant;
  size: ButtonSize;
  disabled?: boolean;
  icon?: React.ReactNode;
}

const ButtonContainer = styled.button<ButtonProps>`
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

  ${({ size, theme }) => {
    switch (size) {
      case 'small':
        return `
          height: 40px;
          padding: 0 16px;
          gap: 6px;
          font-size: ${theme.typography.body3Bold.fontSize};
          line-height: ${theme.typography.body3Bold.lineHeight};
          letter-spacing: ${theme.typography.body3Bold.letterSpacing};
          font-weight: ${theme.typography.body3Bold.fontWeight};
        `;
      case 'medium':
        return `
          height: 48px;
          padding: 0 20px;
          gap: 8px;
          font-size: ${theme.typography.body2Bold.fontSize};
          line-height: ${theme.typography.body2Bold.lineHeight};
          letter-spacing: ${theme.typography.body2Bold.letterSpacing};
          font-weight: ${theme.typography.body2Bold.fontWeight};
        `;
      case 'large':
        return `
          height: 56px;
          padding: 0 24px;
          gap: 10px;
          font-size: ${theme.typography.title2.fontSize};
          line-height: ${theme.typography.title2.lineHeight};
          letter-spacing: ${theme.typography.title2.letterSpacing};
          font-weight: ${theme.typography.title2.fontWeight};
        `;
    }
  }}

  ${({ variant, theme }) => {
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

const Icon = styled.div<Pick<ButtonProps, 'size'> & { hasChildren: boolean }>`
  width: 20px;
  height: 20px;

  ${({ size, hasChildren }) => {
    if (!hasChildren) return null;

    switch (size) {
      case 'small':
        return `
          margin-right: 6px;
        `;
      default:
        return `
          margin-right: 8px;
        `;
    }
  }}
`;

export { ButtonContainer, Icon };
