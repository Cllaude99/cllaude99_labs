import { ButtonHTMLAttributes } from 'react';

import * as S from './Button.styles';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: S.ButtonVariant;
  size?: S.ButtonSize;
  icon?: React.ReactNode;
}

const Button = ({
  children,
  variant = 'primary',
  size = 'medium',
  icon,
  ...rest
}: ButtonProps) => {
  const hasChildren = !!children;

  return (
    <S.ButtonContainer variant={variant} size={size} {...rest}>
      {icon && (
        <S.Icon size={size} hasChildren={hasChildren}>
          {icon}
        </S.Icon>
      )}
      {children}
    </S.ButtonContainer>
  );
};

export default Button;
