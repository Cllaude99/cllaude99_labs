import { HTMLAttributes } from 'react';

import { useInputContext } from '../InputProvider';
import type { InputStatus } from '../InputProvider';
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
  id: idProp,
  ...rest
}: InputDescriptionProps) => {
  const context = useInputContext();

  const descriptionId = context ? `${context.inputId}-description` : idProp;

  return (
    <S.Description
      id={descriptionId}
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
