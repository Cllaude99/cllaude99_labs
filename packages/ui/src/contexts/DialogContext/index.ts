import { createContext } from 'react';

export interface DialogContextValue {
  openDialog: ({ content }: { content: React.ReactNode }) => void;
  closeDialog: () => void;
}

const DialogContext = createContext<DialogContextValue | null>(null);

export default DialogContext;
