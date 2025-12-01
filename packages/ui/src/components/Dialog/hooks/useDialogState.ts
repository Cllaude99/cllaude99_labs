import { useState } from 'react';

const useDialogState = (initialOpen = false) => {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const openDialog = () => setIsOpen(true);
  const closeDialog = () => setIsOpen(false);

  return { isOpen, openDialog, closeDialog };
};

export { useDialogState };
