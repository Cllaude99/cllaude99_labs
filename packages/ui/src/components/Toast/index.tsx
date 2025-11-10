import { Toaster, ToastPosition } from 'react-hot-toast';

const Toast = () => {
  const toastOptions = {
    style: {
      borderRadius: '8px',
      padding: '16px',
      fontSize: '14px',
    },
    error: {
      style: {
        background: '#FEE',
        color: '#C33',
      },
      iconTheme: {
        primary: '#C33',
        secondary: '#FFF',
      },
    },
    duration: 2000,
    position: 'top-center' as ToastPosition,
  };

  return <Toaster toastOptions={toastOptions} />;
};

export default Toast;
