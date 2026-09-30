import { Alert, Box, Button, Dialog, Stack, TextField, Typography } from '@mui/material';
import { ChangeEvent, FormEvent, useState } from 'react';

import { ContactPerson } from '../ContactPerson';
import { nameValidationError } from '../../utils/nameValidation';

interface ContactPersonDialogProps {
  isOpen: boolean;
  isLoading: boolean;
  error: string;
  // The contact person to edit, or null to add a new one.
  initialContactPerson: ContactPerson | null;
  onClose: () => void;
  onSave: (contactPerson: ContactPerson) => void;
}

const NEW_CONTACT_PERSON: ContactPerson = {
  id: '',
  name: '',
  email: '',
  phone: '',
  linkedinUrl: '',
  jobTitle: '',
  notes: '',
};

/** The dialog to add a contact person, or to edit initialContactPerson when it is set. */
export const ContactPersonDialog = ({
  isOpen,
  isLoading,
  error,
  initialContactPerson,
  onClose,
  onSave,
}: ContactPersonDialogProps) => {
  const [contactPerson, setContactPerson] = useState<ContactPerson>(initialContactPerson ?? NEW_CONTACT_PERSON);
  const [nameError, setNameError] = useState<string | null>(null);

  const isEditMode = Boolean(initialContactPerson);

  const handleTextChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    if (name === 'name') {
      setNameError(null);
    }
    setContactPerson((prevContactPerson) => ({ ...prevContactPerson, [name]: value }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // The server checks the other fields, and its message is shown below the form.
    const validationError = nameValidationError(contactPerson.name);
    if (validationError) {
      setNameError(validationError);
      return;
    }
    onSave(contactPerson);
  };

  return (
    // Stays open while saving, so the error of a failed save is shown in it.
    <Dialog open={isOpen} onClose={isLoading ? undefined : onClose} fullWidth maxWidth="sm">
      <Box padding={5}>
        <Typography variant="h4" gutterBottom>
          {isEditMode ? 'Edit contact' : 'New contact'}
        </Typography>
        <form onSubmit={handleSubmit} noValidate>
          {/* No ids, so MUI generates them: the profile's inputs use these names as ids while it is edited. */}
          <Stack spacing={2} pt={2}>
            {/* Aligned to the top, so the name's error message does not stretch the job title. */}
            <Stack direction="row" spacing={2} alignItems="flex-start">
              <TextField
                required
                disabled={isLoading}
                name="name"
                label="Name"
                value={contactPerson.name}
                onChange={handleTextChange}
                error={!!nameError}
                helperText={nameError}
                slotProps={{ htmlInput: { maxLength: 100 } }}
                sx={{ flex: 1 }}
              />
              <TextField
                disabled={isLoading}
                name="jobTitle"
                label="Job title"
                value={contactPerson.jobTitle ?? ''}
                onChange={handleTextChange}
                slotProps={{ htmlInput: { maxLength: 100 } }}
                sx={{ flex: 1 }}
              />
            </Stack>
            <Stack direction="row" spacing={2}>
              <TextField
                disabled={isLoading}
                name="email"
                label="Email"
                type="email"
                value={contactPerson.email ?? ''}
                onChange={handleTextChange}
                slotProps={{ htmlInput: { maxLength: 100 } }}
                sx={{ flex: 1 }}
              />
              <TextField
                disabled={isLoading}
                name="phone"
                label="Phone"
                type="tel"
                value={contactPerson.phone ?? ''}
                onChange={handleTextChange}
                slotProps={{ htmlInput: { maxLength: 30 } }}
                sx={{ flex: 1 }}
              />
            </Stack>
            <TextField
              disabled={isLoading}
              name="linkedinUrl"
              label="LinkedIn"
              type="url"
              placeholder="https://www.linkedin.com/in/example"
              value={contactPerson.linkedinUrl ?? ''}
              onChange={handleTextChange}
              slotProps={{ htmlInput: { maxLength: 200 } }}
            />
            <TextField
              disabled={isLoading}
              name="notes"
              label="Notes"
              multiline
              minRows={2}
              maxRows={6}
              value={contactPerson.notes ?? ''}
              onChange={handleTextChange}
              slotProps={{ htmlInput: { maxLength: 5000 } }}
            />
          </Stack>

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}

          <Stack direction="row" spacing={2} justifyContent="flex-end" mt={2}>
            <Button variant="outlined" disabled={isLoading} onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" loading={isLoading} disabled={isLoading}>
              {isEditMode ? 'Save' : 'Add'}
            </Button>
          </Stack>
        </form>
      </Box>
    </Dialog>
  );
};
