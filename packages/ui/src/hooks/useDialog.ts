import { useContext } from 'react';

import { DialogContext } from '../contexts';

const useDialog = () => {
  const context = useContext(DialogContext);

  if (!context) {
    throw new Error('useDialog는 DialogProvider 내부에서 사용해야 합니다.');
  }

  return context;
};

export default useDialog;
