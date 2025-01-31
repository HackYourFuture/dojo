import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

import { LoadingButton } from '@mui/lab';

interface ConfirmationDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmButtonText: string;
  isLoading: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmationDialog = ({
  confirmButtonText,
  isOpen,
  title,
  message,
  isLoading,
  onConfirm,
  onCancel,
}: ConfirmationDialogProps) => {
  return (
    <Dialog open={isOpen} onClose={onCancel} PaperProps={{ style: { padding: 10 } }}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button disabled={isLoading} onClick={onCancel}>
          Cancel
        </Button>
        <LoadingButton disabled={isLoading} onClick={onConfirm} variant="contained" color="error">
          {confirmButtonText}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};
