import 'the-new-css-reset/css/reset.css';
import './index.css';

import QueryClientProvider from '@cllaude99/apis/components/QueryClientProvider';
import QueryDevTools from '@cllaude99/apis/components/QueryDevTools';
import Cllaude99UIProvider from '@cllaude99/ui/Cllaude99UIProvider';
import Toast from '@cllaude99/ui/Toast';

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
