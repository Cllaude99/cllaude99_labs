import { createContext, useContext } from 'react';

import type { InputSize } from '../types';

interface InputContextProps {
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
  return (
    <InputContext.Provider value={value}>{children}</InputContext.Provider>
  );
};

export { InputProvider, useInputContext };
