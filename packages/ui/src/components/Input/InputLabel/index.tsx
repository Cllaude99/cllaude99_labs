import { LabelHTMLAttributes } from 'react';

import { useInputContext } from '../InputProvider';
import type { InputSize } from '../types';
import * as S from './InputLabel.styles';

export interface InputLabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  size?: InputSize;
  required?: boolean;
  disabled?: boolean;
}

const InputLabel = ({
  children,
  size: sizeProp,
  required = false,
  disabled = false,
  htmlFor,
  ...rest
}: InputLabelProps) => {
  const context = useInputContext();

  const inputSize = context?.size ?? sizeProp ?? 'medium';

  return (
    <S.Label
      inputSize={inputSize}
      disabled={disabled}
      htmlFor={htmlFor}
      {...rest}
    >
      {children}
      {required && <S.RequiredMark aria-hidden="true">*</S.RequiredMark>}
    </S.Label>
  );
};

export default InputLabel;
