import { Alert, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

import { ReactNode } from 'react';

interface ConfirmationDialogProps {
  isOpen: boolean;
  title: string;
  // Shown before the title, like a warning sign.
  icon?: ReactNode;
  message: string;
  confirmButtonText: string;
  isLoading: boolean;
  // Shown under the message, for a dialog that stays open when the action fails.
  error?: string;
  // Keeps the confirm button disabled, like until the user typed what the dialog asks for.
  isConfirmDisabled?: boolean;
  // Shown between the message and the error, like an input.
  children?: ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmationDialog = ({
  confirmButtonText,
  isOpen,
  title,
  icon,
  message,
  isLoading,
  error,
  isConfirmDisabled = false,
  children,
  onConfirm,
  onCancel,
}: ConfirmationDialogProps) => {
  return (
    <Dialog open={isOpen} onClose={isLoading ? undefined : onCancel} slotProps={{ paper: { style: { padding: 10 } } }}>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        {icon}
        {title}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
        {children}
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
        <Button
          disabled={isLoading || isConfirmDisabled}
          loading={isLoading}
          onClick={onConfirm}
          variant="contained"
          color="error"
        >
          {confirmButtonText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
