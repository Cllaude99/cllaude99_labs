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
          height: 36px;
          padding: 0 16px;
          gap: 6px;
          font-size: ${theme.typography.body.body2.fontSize};
          line-height: ${theme.typography.body.body2.lineHeight};
          letter-spacing: ${theme.typography.body.body2.letterSpacing};
          font-weight: 600;
        `;
      case 'medium':
        return `
          height: 44px;
          padding: 0 20px;
          gap: 8px;
          font-size: ${theme.typography.body.body1.fontSize};
          line-height: ${theme.typography.body.body1.lineHeight};
          letter-spacing: ${theme.typography.body.body1.letterSpacing};
          font-weight: 600;
        `;
      case 'large':
        return `
          height: 52px;
          padding: 0 24px;
          gap: 10px;
          font-size: ${theme.typography.title.subhead2.fontSize};
          line-height: ${theme.typography.title.subhead2.lineHeight};
          letter-spacing: ${theme.typography.title.subhead2.letterSpacing};
          font-weight: 700;
        `;
    }
  }}

  ${({ variant, theme }) => {
    switch (variant) {
      case 'primary':
        return `
          color: ${theme.palette.common.white};
          border-color: ${theme.palette.main.blue[50]};
          background-color: ${theme.palette.main.blue[50]};          

          &:hover:not(:disabled) {
            border-color: ${theme.palette.main.blue[40]};
            background-color: ${theme.palette.main.blue[40]};
            transform: translateY(-1px);
          }

          &:active:not(:disabled) {
            border-color: ${theme.palette.main.blue[30]};
            background-color: ${theme.palette.main.blue[30]};
            transform: translateY(0);
          }
        `;
      case 'secondary':
        return `
          color: ${theme.palette.main.blue[50]};
          border-color: ${theme.palette.main.blue[90]};
          background-color: ${theme.palette.main.blue[99]};

          &:hover:not(:disabled) {
            border-color: ${theme.palette.main.blue[80]};
            background-color: ${theme.palette.main.blue[95]};
            transform: translateY(-1px);
          }

          &:active:not(:disabled) {
            border-color: ${theme.palette.main.blue[70]};
            background-color: ${theme.palette.main.blue[90]};
            transform: translateY(0);
          }
        `;
      case 'outline':
        return `
          color: ${theme.palette.main.blue[50]};
          border: 1px solid ${theme.palette.main.blue[50]};          

          &:hover:not(:disabled) {            
            color: ${theme.palette.main.blue[50]};
            background-color: ${theme.palette.main.blue[99]};
            transform: translateY(-1px);
          }

          &:active:not(:disabled) {
            border-color: ${theme.palette.main.blue[40]};
            color: ${theme.palette.main.blue[40]};
            background-color: ${theme.palette.main.blue[95]};
            transform: translateY(0);
          }
        `;
      case 'danger':
        return `
          color: ${theme.palette.common.white};
          border-color: ${theme.palette.main.red[50]};
          background-color: ${theme.palette.main.red[50]};

          &:hover:not(:disabled) {
            border-color: ${theme.palette.main.red[40]};
            background-color: ${theme.palette.main.red[40]};
            transform: translateY(-1px);
          }

          &:active:not(:disabled) {
            border-color: ${theme.palette.main.red[30]};
            background-color: ${theme.palette.main.red[30]};
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
