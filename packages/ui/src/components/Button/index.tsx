import { ButtonHTMLAttributes } from 'react';

import { ButtonProps } from './Button.styles';
import * as S from './Button.styles';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & ButtonProps;

const Button = ({ children, variant, size, icon, ...rest }: Props) => {
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
