import { FormControlLabel, Switch, TextField } from '@mui/material';
import { emailValidationError, nameValidationError } from '../../../../data/text';

import { FormDialog } from '../../../../components/FormDialog';
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

const validateUser = (user: User): FormErrors => {
  return {
    name: nameValidationError(user.name) ?? undefined,
    email: emailValidationError(user.email) ?? undefined,
  };
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

  const handleSubmit = () => {
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
    <FormDialog
      isOpen={isOpen}
      title={isEditMode ? 'Edit user' : 'New user'}
      submitLabel={isEditMode ? 'Save' : 'Create'}
      isSaving={isLoading}
      error={error}
      onClose={onClose}
      onSubmit={handleSubmit}
    >
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
    </FormDialog>
  );
};
