import { Toaster, ToastPosition } from 'react-hot-toast';

import { palette } from '../../design-system/palette';

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
        background: palette.red50,
        color: palette.red500,
      },
      iconTheme: {
        primary: palette.red500,
        secondary: palette.white,
      },
    },
    duration: TOAST_DURATION,
    position: 'top-center' as ToastPosition,
  };

  return <Toaster toastOptions={toastOptions} />;
};

export default Toast;
