import { Alert, Box, Button, Dialog, Stack, Typography } from '@mui/material';
import { FormEvent, ReactNode } from 'react';

interface FormDialogProps {
  isOpen: boolean;
  title: string;
  submitLabel: string;
  isSaving: boolean;
  // Why the last save failed, shown above the buttons.
  error?: string | null;
  onClose: () => void;
  onSubmit: () => void;
  // The fields of the form.
  children: ReactNode;
}

/** A dialog with a form, which stays open while saving so that a failed save shows its error in it. */
export const FormDialog = ({
  isOpen,
  title,
  submitLabel,
  isSaving,
  error,
  onClose,
  onSubmit,
  children,
}: FormDialogProps) => {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <Dialog open={isOpen} onClose={isSaving ? undefined : onClose} fullWidth maxWidth="sm">
      <Box sx={{ padding: 5, backgroundColor: 'background.paper' }}>
        <Typography variant="h4" gutterBottom>
          {title}
        </Typography>
        <form onSubmit={handleSubmit} noValidate>
          <Stack spacing={2} sx={{ pt: 2 }}>
            {children}
          </Stack>

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}

          <Stack direction="row" spacing={2} sx={{ justifyContent: 'flex-end', mt: 2 }}>
            <Button variant="outlined" disabled={isSaving} onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" loading={isSaving} disabled={isSaving}>
              {submitLabel}
            </Button>
          </Stack>
        </form>
      </Box>
    </Dialog>
  );
};
