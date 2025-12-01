import { useEffect, useRef } from 'react';

import * as S from './DialogContent.styles';

interface DialogContentProps {
  children: React.ReactNode;
}

const DialogContent = ({ children }: DialogContentProps) => {
  const contentRef = useRef<HTMLDivElement>(null);

  /* 포커스 트랩 */
  useEffect(() => {
    const container = contentRef.current;
    if (!container) return;

    const focusableSelectors = [
      'a[href]',
      'button:not([disabled])',
      'textarea:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
    ].join(', ');

    const getFocusableElements = (): HTMLElement[] => {
      const nodeList = container.querySelectorAll(focusableSelectors);
      const elements: HTMLElement[] = [];
      for (let i = 0; i < nodeList.length; i++) {
        elements.push(nodeList[i] as HTMLElement);
      }
      return elements;
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;

      const focusableElements = getFocusableElements();
      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    const focusableElements = getFocusableElements();
    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    }

    container.addEventListener('keydown', handleKeyDown);

    return () => {
      container.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <S.Container ref={contentRef} role="dialog" aria-modal="true">
      {children}
    </S.Container>
  );
};

export default DialogContent;
