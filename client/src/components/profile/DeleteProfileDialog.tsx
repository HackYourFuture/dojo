import { Avatar, TextField, Typography } from '@mui/material';

import { ConfirmationDialog } from '../ConfirmationDialog';
import { ProfileType } from '../../data/types/ProfileType';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import { alpha } from '@mui/material/styles';
import { useState } from 'react';

interface DeleteProfileDialogProps {
  isOpen: boolean;
  profileType: ProfileType;
  // The name the user has to type to confirm.
  name: string;
  // What is deleted with the profile, like "interactions and profile picture".
  relatedData: string;
  isDeleting: boolean;
  error?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

// The page shows any run of spaces, tabs or non-breaking spaces as one space, so the names are compared the same way.
const normalizeSpaces = (text: string) => text.split(/\s+/).filter(Boolean).join(' ');

/** Asks to type the profile's name before deleting it with all its data. */
export const DeleteProfileDialog = ({
  isOpen,
  profileType,
  name,
  relatedData,
  isDeleting,
  error,
  onConfirm,
  onCancel,
}: DeleteProfileDialogProps) => {
  const [typedName, setTypedName] = useState('');
  const isNameTyped = normalizeSpaces(typedName) === normalizeSpaces(name);

  const handleCancel = () => {
    setTypedName('');
    onCancel();
  };

  return (
    <ConfirmationDialog
      isOpen={isOpen}
      title={`Delete ${profileType}`}
      icon={
        // A span, as the title is a heading.
        <Avatar
          component="span"
          sx={{ bgcolor: (theme) => alpha(theme.palette.error.main, 0.15), color: 'error.main' }}
        >
          <WarningAmberRoundedIcon />
        </Avatar>
      }
      message={`This permanently deletes ${name} and all related data: ${relatedData}. This cannot be undone.`}
      confirmButtonText={`Delete ${profileType}`}
      isLoading={isDeleting}
      isConfirmDisabled={!isNameTyped}
      error={error}
      onConfirm={onConfirm}
      onCancel={handleCancel}
    >
      <Typography sx={{ mt: 2, mb: 1 }}>
        Type <strong>{name}</strong> to confirm.
      </Typography>
      <TextField
        value={typedName}
        onChange={(event) => setTypedName(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' && isNameTyped && !isDeleting) {
            onConfirm();
          }
        }}
        disabled={isDeleting}
        autoFocus
        fullWidth
        size="small"
        autoComplete="off"
        slotProps={{ htmlInput: { 'aria-label': `${profileType} name` } }}
      />
    </ConfirmationDialog>
  );
};
