import { Toaster, ToastPosition } from 'react-hot-toast';

import { palette } from '../../design-system';

const Toast = () => {
  const TOAST_DURATION = 2000;

  const toastOptions = {
    style: {
      borderRadius: '8px',
      padding: '16px',
      fontSize: '14px',
    },
    error: {
      style: {
        background: palette.main.red[95],
        color: palette.main.red[50],
      },
      iconTheme: {
        primary: palette.main.red[50],
        secondary: palette.common.white,
      },
    },
    duration: TOAST_DURATION,
    position: 'top-center' as ToastPosition,
  };

  return <Toaster toastOptions={toastOptions} />;
};

export default Toast;
