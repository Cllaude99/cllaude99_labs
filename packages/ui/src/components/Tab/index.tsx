import Tabs from './Tabs';
import TabsContent from './TabsContent';
import TabsList from './TabsList';
import TabsTrigger from './TabsTrigger';

interface TabProps {
  tabItems: Array<{
    menu: string;
    content: React.ReactNode;
  }>;
}

const Tab = ({ tabItems }: TabProps) => {
  return (
    <Tabs defaultValue={tabItems[0].menu}>
      <TabsList>
        {tabItems.map((item) => (
          <TabsTrigger key={item.menu} value={item.menu}>
            {item.menu}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabItems.map((item) => (
        <TabsContent key={item.menu} value={item.menu}>
          {item.content}
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default Tab;
