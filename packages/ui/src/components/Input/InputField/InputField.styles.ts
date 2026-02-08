import styled from '@emotion/styled';

import type { InputSize, InputStatus } from '../types';

export interface InputFieldStyleProps {
  inputSize: InputSize;
  status: InputStatus;
  disabled?: boolean;
  readOnly?: boolean;
}

const Wrapper = styled.div<InputFieldStyleProps>`
  display: flex;
  align-items: stretch;
  border-radius: 8px;
  border: 1px solid;
  transition: all 0.2s ease-in-out;
  cursor: text;

  ${({ inputSize, theme }) => {
    switch (inputSize) {
      case 'small':
        return `
          min-height: 36px;
          padding-left: 12px;
          ${theme.typography.body3.styles};
        `;
      case 'medium':
        return `
          min-height: 44px;
          padding-left: 14px;
          ${theme.typography.body2.styles};
        `;
      case 'large':
        return `
          min-height: 52px;
          padding-left: 16px;
          ${theme.typography.body1.styles};
        `;
    }
  }}

  ${({ status, disabled, readOnly, theme }) => {
    if (disabled) {
      return `
        border-color: ${theme.palette.grey200};
        background-color: ${theme.palette.grey50};
        cursor: not-allowed;
        color: ${theme.palette.grey400};
      `;
    }

    if (readOnly) {
      return `
        border-color: ${theme.palette.grey200};
        background-color: ${theme.palette.grey50};
        color: ${theme.palette.grey700};
      `;
    }

    switch (status) {
      case 'error':
        return `
          border-color: ${theme.palette.red500};
          background-color: ${theme.palette.white};

          &:focus-within {
            border-color: ${theme.palette.red500};
            box-shadow: 0 0 0 3px ${theme.palette.red50};
          }
        `;
      case 'success':
        return `
          border-color: ${theme.palette.green500};
          background-color: ${theme.palette.white};

          &:focus-within {
            border-color: ${theme.palette.green500};
            box-shadow: 0 0 0 3px ${theme.palette.green50};
          }
        `;
      default:
        return `
          border-color: ${theme.palette.grey200};
          background-color: ${theme.palette.white};

          &:hover {
            border-color: ${theme.palette.grey300};
          }

          &:focus-within {
            border-color: ${theme.palette.blue500};
            box-shadow: 0 0 0 3px ${theme.palette.blue50};
          }
        `;
    }
  }}
`;

const NativeInput = styled.input<{ disabled?: boolean }>`
  flex: 1;
  border: none;
  background: transparent;
  outline: none;
  color: inherit;
  font: inherit;
  min-width: 0;
  padding: 10px 12px 10px 0;

  &::placeholder {
    color: ${({ theme }) => theme.palette.grey400};
  }

  &:disabled {
    cursor: not-allowed;
  }
`;

const IconSlot = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  align-self: center;
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  color: ${({ theme }) => theme.palette.grey500};
  margin-right: 8px;
`;

const ButtonSlot = styled.div`
  display: flex;
  align-items: stretch;
  flex-shrink: 0;
  padding: 4px 4px 4px 0;

  & > button {
    transform: none !important;
    align-self: stretch;

    &:hover {
      transform: none !important;
    }

    &:active {
      transform: none !important;
    }
  }
`;

interface FileInputWrapperProps extends InputFieldStyleProps {
  isDragging?: boolean;
}

const FileInputWrapper = styled.div<FileInputWrapperProps>`
  display: flex;
  align-items: center;
  border-radius: 8px;
  border: 1px solid;
  transition: all 0.2s ease-in-out;
  cursor: pointer;
  gap: 8px;

  ${({ inputSize, theme }) => {
    switch (inputSize) {
      case 'small':
        return `
          min-height: 36px;
          padding: 0 12px;
          ${theme.typography.body3.styles};
        `;
      case 'medium':
        return `
          min-height: 44px;
          padding: 0 14px;
          ${theme.typography.body2.styles};
        `;
      case 'large':
        return `
          min-height: 52px;
          padding: 0 16px;
          ${theme.typography.body1.styles};
        `;
    }
  }}

  ${({ status, disabled, isDragging, theme }) => {
    if (disabled) {
      return `
        border-color: ${theme.palette.grey200};
        background-color: ${theme.palette.grey50};
        cursor: not-allowed;
        color: ${theme.palette.grey400};
      `;
    }

    if (isDragging) {
      return `
        border-color: ${theme.palette.blue500};
        background-color: ${theme.palette.blue100};
        border-style: solid;
      `;
    }

    switch (status) {
      case 'error':
        return `
          border-color: ${theme.palette.red500};
          background-color: ${theme.palette.white};

          &:hover {
            border-color: ${theme.palette.red600};
          }
        `;
      case 'success':
        return `
          border-color: ${theme.palette.green500};
          background-color: ${theme.palette.white};

          &:hover {
            border-color: ${theme.palette.green600};
          }
        `;
      default:
        return `
          border-color: ${theme.palette.grey200};
          background-color: ${theme.palette.white};

          &:hover {
            border-color: ${theme.palette.blue500};
            background-color: ${theme.palette.blue50};
          }
        `;
    }
  }}
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const FileInputContent = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const FileInputButton = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px 16px;
  border-radius: 6px;
  background-color: ${({ theme }) => theme.palette.blue50};
  color: ${({ theme }) => theme.palette.blue600};
  font-weight: 600;
  font-size: 14px;
  line-height: 20px;
  letter-spacing: -0.01em;
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  user-select: none;

  &:hover {
    background-color: ${({ theme }) => theme.palette.blue100};
    color: ${({ theme }) => theme.palette.blue700};
  }

  &:active {
    background-color: ${({ theme }) => theme.palette.blue200};
    color: ${({ theme }) => theme.palette.blue800};
  }
`;

const FileInputText = styled.div`
  flex: 1;
  color: ${({ theme }) => theme.palette.grey600};
  ${({ theme }) => theme.typography.body3.styles};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export {
  Wrapper,
  NativeInput,
  IconSlot,
  ButtonSlot,
  FileInputWrapper,
  HiddenFileInput,
  FileInputContent,
  FileInputButton,
  FileInputText,
};
