import { useState } from 'react';

import DialogContent from './DialogContent';
import DialogOverlay from './DialogOverlay';
import DialogRoot from './DialogRoot';
import DialogContext from '../../contexts/DialogContext';

interface DialogProviderProps {
  children: React.ReactNode;
}

const DialogProvider = ({ children }: DialogProviderProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState<React.ReactNode>(null);

  const openDialog = ({ content }: { content: React.ReactNode }) => {
    setContent(content);
    setIsOpen(true);
  };

  const closeDialog = () => {
    setIsOpen(false);
    setContent(null);
  };

  return (
    <DialogContext.Provider value={{ openDialog, closeDialog }}>
      {children}
      <DialogRoot isOpen={isOpen} closeDialog={closeDialog}>
        <DialogOverlay closeDialog={closeDialog} />
        <DialogContent>{content}</DialogContent>
      </DialogRoot>
    </DialogContext.Provider>
  );
};

export default DialogProvider;
