import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const QueryDevTools = () => {
  return (
    <ReactQueryDevtools
      initialIsOpen={import.meta.env.MODE === 'development'}
    />
  );
};

export default QueryDevTools;
