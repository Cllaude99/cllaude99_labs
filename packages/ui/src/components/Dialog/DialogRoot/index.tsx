import { useEffect } from 'react';

import Portal from '../../Portal';

interface DialogRootProps {
  isOpen: boolean;
  closeDialog: () => void;
  children: React.ReactNode;
}

const DialogRoot = ({ isOpen, closeDialog, children }: DialogRootProps) => {
  /* ESC 키로 닫기 */
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeDialog();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeDialog]);

  /* 스크롤 락 */
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;

    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = `${scrollbarWidth}px`;

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return <Portal>{children}</Portal>;
};

export default DialogRoot;
