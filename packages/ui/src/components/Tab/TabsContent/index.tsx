import * as S from './TabsContent.styles';
import { useTabsContext } from '../TabsProvider';

interface TabsContentProps {
  value: string;
  children: React.ReactNode;
}

const TabsContent = ({ value, children }: TabsContentProps) => {
  const { value: selectedValue } = useTabsContext();
  const isSelected = selectedValue === value;

  if (!isSelected) {
    return null;
  }

  return <S.Container role="tabpanel">{children}</S.Container>;
};

export default TabsContent;
