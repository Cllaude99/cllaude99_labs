import { useTabsContext } from '../TabsProvider';
import * as S from './TabsTrigger.styles';

interface TabsTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
  children: React.ReactNode;
}

const TabsTrigger = ({ value, children, ...rest }: TabsTriggerProps) => {
  const { value: selectedValue, setValue } = useTabsContext();
  const isActive = selectedValue === value;

  return (
    <S.Button
      type="button"
      role="tab"
      aria-selected={isActive}
      isActive={isActive}
      onClick={() => setValue(value)}
      {...rest}
    >
      {isActive && (
        <S.ActiveIndicator
          layoutId="activeTabIndicator"
          transition={{
            type: 'tween',
          }}
        />
      )}
      <S.TabTriggerContent>{children}</S.TabTriggerContent>
    </S.Button>
  );
};

export default TabsTrigger;
