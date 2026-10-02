import { Alert, Box, Button, Dialog, FormControlLabel, Stack, Switch, TextField, Typography } from '@mui/material';

import { User } from '../models/user';
import { useState } from 'react';

interface UserDetailsDialogProps {
  isOpen: boolean;
  isLoading: boolean;
  error?: string;
  onClose: () => void;
  onConfirmAdd: (user: User) => void;
  onConfirmEdit: (user: User) => void;
  initialUser: User | null;
}

interface FormErrors {
  name?: string;
  email?: string;
}

const NEW_USER: User = { id: '', name: '', email: '', thumbnailUrl: null, isActive: true };

const FIELD_REQUIRED_ERROR = 'This field is required';

// A single @ with text before it, and a dot inside the domain after it.
const isValidEmail = (email: string) => {
  const parts = email.split('@');
  if (parts.length !== 2 || parts[0] === '') {
    return false;
  }
  const dotIndex = parts[1].indexOf('.');
  return dotIndex > 0 && dotIndex < parts[1].length - 1;
};

const validateUser = (user: User): FormErrors => {
  const errors: FormErrors = {};
  const name = user.name.trim();
  const email = user.email.trim();

  if (!name) {
    errors.name = FIELD_REQUIRED_ERROR;
  } else if (name.length < 2) {
    errors.name = 'Name must be at least 2 characters';
  }

  if (!email) {
    errors.email = FIELD_REQUIRED_ERROR;
  } else if (!isValidEmail(email)) {
    errors.email = 'Email must be of format name@domain.com';
  }

  return errors;
};

/** The dialog to add a new user, or to edit initialUser when it is set. */
export const UserDetailsDialog = ({
  isOpen,
  isLoading,
  error,
  onClose,
  onConfirmAdd,
  onConfirmEdit,
  initialUser,
}: UserDetailsDialogProps) => {
  const [userFields, setUserFields] = useState<User>(initialUser ?? NEW_USER);
  const [errors, setErrors] = useState<FormErrors>({});

  const isEditMode = Boolean(initialUser);

  const handleTextChange = (field: keyof FormErrors) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setErrors((prevErrors) => ({ ...prevErrors, [field]: undefined }));
    setUserFields((prevFields) => ({ ...prevFields, [field]: value }));
  };

  const handleActiveChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target;
    setUserFields((prevFields) => ({ ...prevFields, isActive: checked }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formErrors = validateUser(userFields);
    if (formErrors.name || formErrors.email) {
      setErrors(formErrors);
      return;
    }

    if (isEditMode) {
      onConfirmEdit(userFields);
    } else {
      onConfirmAdd(userFields);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="sm">
      <Box sx={{ padding: 5 }}>
        <Typography variant="h4" gutterBottom>
          {isEditMode ? 'Edit user' : 'New user'}
        </Typography>
        <form onSubmit={handleSubmit} noValidate>
          <Stack spacing={2} sx={{ pt: 2 }}>
            <TextField
              required
              disabled={isLoading}
              id="name"
              label="Name"
              value={userFields.name}
              onChange={handleTextChange('name')}
              error={!!errors.name}
              helperText={errors.name}
              slotProps={{ htmlInput: { maxLength: 100 } }}
            />
            <TextField
              required
              disabled={isLoading}
              id="email"
              label="Email"
              type="email"
              value={userFields.email}
              onChange={handleTextChange('email')}
              error={!!errors.email}
              helperText={errors.email}
              slotProps={{ htmlInput: { maxLength: 100 } }}
            />
            <FormControlLabel
              control={<Switch disabled={isLoading} checked={userFields.isActive} onChange={handleActiveChange} />}
              label="Active"
            />
          </Stack>

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}

          <Stack direction="row" spacing={2} sx={{ justifyContent: 'flex-end', mt: 2 }}>
            <Button variant="outlined" disabled={isLoading} onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" loading={isLoading} disabled={isLoading}>
              {isEditMode ? 'Save' : 'Create'}
            </Button>
          </Stack>
        </form>
      </Box>
    </Dialog>
  );
};
