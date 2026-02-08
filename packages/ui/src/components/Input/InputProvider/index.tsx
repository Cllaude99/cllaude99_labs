import { createContext, useContext } from 'react';

type InputSize = 'small' | 'medium' | 'large';
type InputStatus = 'default' | 'error' | 'success';

interface InputContextProps {
  inputId: string;
  size: InputSize;
}

const InputContext = createContext<InputContextProps | null>(null);

const useInputContext = () => {
  return useContext(InputContext);
};

interface InputProviderProps {
  children: React.ReactNode;
  value: InputContextProps;
}

const InputProvider = ({ children, value }: InputProviderProps) => {
  return <InputContext.Provider value={value}>{children}</InputContext.Provider>;
};

export { InputProvider, useInputContext };
export type { InputSize, InputStatus, InputContextProps };
