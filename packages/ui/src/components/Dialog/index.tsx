import DialogContent from './DialogContent';
import DialogOverlay from './DialogOverlay';
import DialogRoot from './DialogRoot';
import { useDialogState } from './hooks/useDialogState';

interface DialogProps {
  trigger: ({ openDialog }: { openDialog: () => void }) => React.ReactNode;
  content: ({ closeDialog }: { closeDialog: () => void }) => React.ReactNode;
}

const Dialog = ({ trigger, content }: DialogProps) => {
  const { isOpen, openDialog, closeDialog } = useDialogState();

  return (
    <>
      {trigger({ openDialog })}

      <DialogRoot isOpen={isOpen} closeDialog={closeDialog}>
        <DialogOverlay closeDialog={closeDialog} />
        <DialogContent>{content({ closeDialog })}</DialogContent>
      </DialogRoot>
    </>
  );
};

export default Dialog;
