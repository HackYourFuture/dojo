import { Box, Button } from '@mui/material';

import { ReactNode } from 'react';

interface ProfileButtonsProps {
  activeTab: string;
  isEditMode: boolean;
  isSaving: boolean;
  onClickEditButton: () => void;
  onCancel: () => void;
  // The Actions button, last so it stays in place when the edit buttons are hidden.
  actions: ReactNode;
}

/** The Edit button, or Cancel and Save while editing, and the Actions button at the top right of a profile. */
export const ProfileButtons = ({
  activeTab,
  isEditMode,
  isSaving,
  onClickEditButton,
  onCancel,
  actions,
}: ProfileButtonsProps) => {
  // Interactions are edited one by one, so their tab only needs Save and Cancel while the profile is being edited.
  const showsEditButtons = activeTab !== 'interactions' || isEditMode;

  return (
    <Box sx={{ display: 'flex', gap: 1 }}>
      {showsEditButtons && (
        <>
          {isEditMode && (
            <Button variant="outlined" disabled={isSaving} onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button variant="contained" loading={isSaving} onClick={onClickEditButton}>
            {isEditMode ? 'Save' : 'Edit'}
          </Button>
        </>
      )}
      {actions}
    </Box>
  );
};
