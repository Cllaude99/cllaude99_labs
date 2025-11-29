import { createContext, useContext } from 'react';

interface TabsContextProps {
  value: string;
  setValue: (value: string) => void;
}

const TabsContext = createContext<TabsContextProps | null>(null);

const useTabsContext = () => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('Tabs 컴포넌트 내부에서만 사용할 수 있습니다.');
  }
  return context;
};

interface TabsProviderProps {
  children: React.ReactNode;
  value: TabsContextProps;
}

const TabsProvider = ({ children, value }: TabsProviderProps) => {
  return <TabsContext.Provider value={value}>{children}</TabsContext.Provider>;
};

export { TabsProvider, useTabsContext };
