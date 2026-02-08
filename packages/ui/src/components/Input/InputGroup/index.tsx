import { HTMLAttributes } from 'react';

import { InputProvider } from '../InputProvider';
import type { InputSize } from '../types';
import * as S from './InputGroup.styles';

export interface InputGroupProps extends HTMLAttributes<HTMLDivElement> {
  size?: InputSize;
}

const InputGroup = ({ children, size = 'medium', ...rest }: InputGroupProps) => {
  return (
    <InputProvider value={{ size }}>
      <S.Group role="group" {...rest}>
        {children}
      </S.Group>
    </InputProvider>
  );
};

export default InputGroup;
