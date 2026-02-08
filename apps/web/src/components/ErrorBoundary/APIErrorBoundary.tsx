import { ErrorBoundary, FallbackProps } from 'react-error-boundary';

import { useQueryErrorResetBoundary } from '@tanstack/react-query';
import { isAxiosError } from 'axios';

import { getAPIErrorInfo } from '@cllaude99/apis/utils/getAPIErrorInfo';

import SomethingWentWrong from '@/components/ErrorPage/SomethingWentWrong';

const APIErrorFallback = ({ error, resetErrorBoundary }: FallbackProps) => {
  const isDevelopmentMode = import.meta.env.MODE === 'development';
  const isApiFetchingError = isAxiosError(error);

  if (isApiFetchingError && isDevelopmentMode) {
    const { status, message: errorMessage } = getAPIErrorInfo(error);

    return (
      <SomethingWentWrong
        onRetry={resetErrorBoundary}
        status={status}
        errorMessage={errorMessage}
      />
    );
  } else {
    throw error;
  }
};

const APIErrorBoundary = ({ children }: { children: React.ReactNode }) => {
  const { reset } = useQueryErrorResetBoundary();

  return (
    <ErrorBoundary FallbackComponent={APIErrorFallback} onReset={reset}>
      {children}
    </ErrorBoundary>
  );
};

export default APIErrorBoundary;
