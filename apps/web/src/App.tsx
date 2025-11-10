import 'the-new-css-reset/css/reset.css';
import './index.css';

import { QueryClientProvider, QueryDevTools } from '@cllaude99/apis';
import { Cllaude99UIProvider, Toast } from '@cllaude99/ui';

import RouteProvider from './routes/RouteProvider';

const App = () => {
  return (
    <>
      <QueryClientProvider>
        <QueryDevTools />
        <Cllaude99UIProvider>
          <RouteProvider />
        </Cllaude99UIProvider>
      </QueryClientProvider>
      <Toast />
    </>
  );
};

export default App;
