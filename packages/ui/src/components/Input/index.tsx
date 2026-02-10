import { InputHTMLAttributes, forwardRef, useId } from 'react';

import InputDescription from './InputDescription';
import InputField from './InputField';
import InputGroup from './InputGroup';
import InputLabel from './InputLabel';
import type { InputSize, InputStatus } from './types';

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  type?: React.HTMLInputTypeAttribute;
  label?: string;
  description?: string;
  size?: InputSize;
  status?: InputStatus;
  required?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  endButton?: React.ReactNode;
}

const InputBase = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      id: idProp,
      type,
      label,
      description,
      size = 'medium',
      status = 'default',
      required,
      disabled,
      readOnly,
      startIcon,
      endIcon,
      endButton,
      ...rest
    },
    ref,
  ) => {
    const autoId = useId();
    const inputId = idProp ?? autoId;
    const descriptionId = description ? `${inputId}-description` : undefined;

    return (
      <InputGroup size={size}>
        {label && (
          <InputLabel htmlFor={inputId} required={required} disabled={disabled}>
            {label}
          </InputLabel>
        )}
        <InputField
          ref={ref}
          id={inputId}
          type={type}
          status={status}
          disabled={disabled}
          readOnly={readOnly}
          startIcon={startIcon}
          endIcon={endIcon}
          endButton={endButton}
          aria-describedby={descriptionId}
          {...rest}
        />
        {description && (
          <InputDescription
            id={descriptionId}
            status={status}
            disabled={disabled}
          >
            {description}
          </InputDescription>
        )}
      </InputGroup>
    );
  },
);

InputBase.displayName = 'Input';

const Input = Object.assign(InputBase, {
  Field: InputField,
  Label: InputLabel,
  Description: InputDescription,
  Group: InputGroup,
});

export default Input;
