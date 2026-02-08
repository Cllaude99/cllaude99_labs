import toast from 'react-hot-toast';

import {
  QueryClient,
  QueryClientProvider as BaseQueryClientProvider,
} from '@tanstack/react-query';
import { isAxiosError } from 'axios';

import { getAPIErrorInfo } from '../utils/getAPIErrorInfo';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      throwOnError: true,
    },
    mutations: {
      onError: (error: unknown) => {
        const isDevelopmentMode = import.meta.env.MODE === 'development';
        const isApiFetchingError = isAxiosError(error);

        if (isApiFetchingError && isDevelopmentMode) {
          const errorInfo = getAPIErrorInfo(error);
          toast.error(errorInfo.message);
        } else {
          toast.error(
            '알 수 없는 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
          );
        }
      },
    },
  },
});

const QueryClientProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <BaseQueryClientProvider client={queryClient}>
      {children}
    </BaseQueryClientProvider>
  );
};

export default QueryClientProvider;
