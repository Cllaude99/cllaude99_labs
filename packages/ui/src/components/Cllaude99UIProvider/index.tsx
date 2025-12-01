import DialogProvider from '../Dialog';
import ThemeProvider from '../ThemeProvider';

interface Cllaude99UIProviderProps {
  children: React.ReactNode;
}

const Cllaude99UIProvider = ({ children }: Cllaude99UIProviderProps) => {
  return (
    <ThemeProvider>
      <DialogProvider>{children}</DialogProvider>
    </ThemeProvider>
  );
};

export default Cllaude99UIProvider;
