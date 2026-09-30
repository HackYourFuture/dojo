import { Alert, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

interface ConfirmationDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmButtonText: string;
  isLoading: boolean;
  // Shown under the message, for a dialog that stays open when the action fails.
  error?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmationDialog = ({
  confirmButtonText,
  isOpen,
  title,
  message,
  isLoading,
  error,
  onConfirm,
  onCancel,
}: ConfirmationDialogProps) => {
  return (
    <Dialog open={isOpen} onClose={onCancel} PaperProps={{ style: { padding: 10 } }}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </DialogContent>
      <DialogActions>
        <Button disabled={isLoading} onClick={onCancel}>
          Cancel
        </Button>
        <Button disabled={isLoading} loading={isLoading} onClick={onConfirm} variant="contained" color="error">
          {confirmButtonText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
