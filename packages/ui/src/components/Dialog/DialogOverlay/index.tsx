import { HTMLAttributes } from 'react';

import * as S from './DialogOverlay.styles';

interface DialogOverlayProps extends HTMLAttributes<HTMLDivElement> {
  closeDialog: () => void;
}

const DialogOverlay = ({ closeDialog }: DialogOverlayProps) => {
  return (
    <S.DimmedContainer
      onClick={() => {
        closeDialog();
      }}
    />
  );
};

export default DialogOverlay;
