import * as S from './TabsList.styles';

interface TabsListProps {
  children: React.ReactNode;
}

const TabsList = ({ children }: TabsListProps) => {
  return <S.Container role="tablist">{children}</S.Container>;
};

export default TabsList;
