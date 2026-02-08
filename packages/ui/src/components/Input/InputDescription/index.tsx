import { HTMLAttributes } from 'react';

import type { InputStatus } from '../types';
import * as S from './InputDescription.styles';

export interface InputDescriptionProps
  extends HTMLAttributes<HTMLParagraphElement> {
  status?: InputStatus;
  disabled?: boolean;
}

const InputDescription = ({
  children,
  status = 'default',
  disabled = false,
  id,
  ...rest
}: InputDescriptionProps) => {
  return (
    <S.Description
      id={id}
      status={status}
      disabled={disabled}
      role={status === 'error' ? 'alert' : undefined}
      {...rest}
    >
      {children}
    </S.Description>
  );
};

export default InputDescription;
