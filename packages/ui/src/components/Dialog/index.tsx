import DialogContent from './DialogContent';
import DialogOverlay from './DialogOverlay';
import DialogRoot from './DialogRoot';
import { useDialog } from './hooks/useDialog';

interface DialogProps {
  trigger: ({ openDialog }: { openDialog: () => void }) => React.ReactNode;
  content: ({ closeDialog }: { closeDialog: () => void }) => React.ReactNode;
}

const Dialog = ({ trigger, content }: DialogProps) => {
  const { isOpen, openDialog, closeDialog } = useDialog();

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
