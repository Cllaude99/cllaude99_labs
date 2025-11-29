import { useState } from 'react';

import * as S from './Tabs.styles';
import { TabsProvider } from '../TabsProvider';

interface TabsProps {
  defaultValue: string;
  children: React.ReactNode;
}

const Tabs = ({ defaultValue, children }: TabsProps) => {
  const [value, setValue] = useState(defaultValue);

  return (
    <TabsProvider value={{ value, setValue }}>
      <S.Container>{children}</S.Container>
    </TabsProvider>
  );
};

export default Tabs;
