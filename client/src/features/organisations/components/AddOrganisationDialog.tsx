import { Alert, Box, Button, Dialog, SelectChangeEvent, Stack, TextField, Typography } from '@mui/material';
import { ChangeEvent, FormEvent, useState } from 'react';
import { NewOrganisation, OrganisationStatus } from '../Organisation';

import { DropdownSelect } from '../../trainee-profile/profile/components/DropdownSelect';
import { nameValidationError } from '../utils/nameValidation';
import { organisationStatusOptions } from '../utils/organisationStatus';
import { useCreateOrganisation } from '../data/mutations';
import { useNavigate } from 'react-router-dom';

interface AddOrganisationDialogProps {
  isOpen: boolean;
  handleClose: () => void;
}

const INITIAL_STATE: NewOrganisation = {
  name: '',
  status: OrganisationStatus.Active,
  location: '',
  websiteUrl: '',
  linkedinUrl: '',
};

/** The dialog to add an organisation, which opens the profile of the new organisation. */
export const AddOrganisationDialog = ({ isOpen, handleClose }: AddOrganisationDialogProps) => {
  const navigate = useNavigate();
  const { mutate: createOrganisation, isPending, error: submitError, reset } = useCreateOrganisation();

  const [formState, setFormState] = useState<NewOrganisation>(INITIAL_STATE);
  const [nameError, setNameError] = useState<string | null>(null);

  // Also forgets the error of the last attempt, so it is not shown the next time the dialog opens.
  const onClose = () => {
    setFormState(INITIAL_STATE);
    setNameError(null);
    reset();
    handleClose();
  };

  const handleTextChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (name === 'name') {
      setNameError(null);
    }
    setFormState((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleStatusChange = (event: SelectChangeEvent<string>) => {
    setFormState((prevState) => ({ ...prevState, status: event.target.value as OrganisationStatus }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // The server checks the other fields, and its message is shown below the form.
    const error = nameValidationError(formState.name);
    if (error) {
      setNameError(error);
      return;
    }

    createOrganisation(formState, {
      onSuccess: (organisation) => {
        onClose();
        navigate(organisation.profilePath);
      },
    });
  };

  return (
    // Stays open while the organisation is created, so its profile still opens when it is ready.
    <Dialog open={isOpen} onClose={isPending ? undefined : onClose} fullWidth maxWidth="sm">
      <Box padding={5} sx={{ backgroundColor: 'background.paper' }}>
        <Typography variant="h4" gutterBottom>
          New organisation
        </Typography>
        <form onSubmit={handleSubmit} noValidate>
          <Stack spacing={2} pt={2}>
            <TextField
              required
              disabled={isPending}
              id="name"
              name="name"
              label="Name"
              value={formState.name}
              onChange={handleTextChange}
              error={!!nameError}
              helperText={nameError}
              slotProps={{ htmlInput: { maxLength: 200 } }}
            />
            <Stack direction="row" spacing={2}>
              <DropdownSelect
                id="status"
                name="status"
                label="Status"
                options={organisationStatusOptions}
                disabled={isPending}
                value={formState.status}
                onChange={handleStatusChange}
              />
              <TextField
                disabled={isPending}
                id="location"
                name="location"
                label="Location"
                value={formState.location}
                onChange={handleTextChange}
                slotProps={{ htmlInput: { maxLength: 100 } }}
                sx={{ flex: 1 }}
              />
            </Stack>
            <TextField
              disabled={isPending}
              id="websiteUrl"
              name="websiteUrl"
              label="Website"
              type="url"
              placeholder="https://example.com"
              value={formState.websiteUrl}
              onChange={handleTextChange}
              slotProps={{ htmlInput: { maxLength: 200 } }}
            />
            <TextField
              disabled={isPending}
              id="linkedinUrl"
              name="linkedinUrl"
              label="LinkedIn"
              type="url"
              placeholder="https://www.linkedin.com/company/example"
              value={formState.linkedinUrl}
              onChange={handleTextChange}
              slotProps={{ htmlInput: { maxLength: 200 } }}
            />
          </Stack>

          {submitError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              An error occurred while creating the organisation: {submitError.message || 'unknown'}
            </Alert>
          )}

          <Stack direction="row" spacing={2} justifyContent="flex-end" mt={2}>
            <Button variant="outlined" disabled={isPending} onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" loading={isPending} disabled={isPending}>
              Create
            </Button>
          </Stack>
        </form>
      </Box>
    </Dialog>
  );
};
