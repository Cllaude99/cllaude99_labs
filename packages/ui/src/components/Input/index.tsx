import { InputHTMLAttributes } from 'react';

import InputDescription from './InputDescription';
import InputField from './InputField';
import InputGroup from './InputGroup';
import InputLabel from './InputLabel';
import type { InputSize, InputStatus } from './InputProvider';

interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  description?: string;
  size?: InputSize;
  status?: InputStatus;
  required?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  endButton?: React.ReactNode;
}

function Input({
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
}: InputProps) {
  return (
    <InputGroup size={size}>
      {label && (
        <InputLabel required={required} disabled={disabled}>
          {label}
        </InputLabel>
      )}
      <InputField
        status={status}
        disabled={disabled}
        readOnly={readOnly}
        startIcon={startIcon}
        endIcon={endIcon}
        endButton={endButton}
        {...rest}
      />
      {description && (
        <InputDescription status={status} disabled={disabled}>
          {description}
        </InputDescription>
      )}
    </InputGroup>
  );
}

Input.Field = InputField;
Input.Label = InputLabel;
Input.Description = InputDescription;
Input.Group = InputGroup;

export default Input;
export { InputField, InputLabel, InputDescription, InputGroup };
