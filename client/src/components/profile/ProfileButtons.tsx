import { Box, Button } from '@mui/material';

import { ReactNode } from 'react';

// The tabs with a list of items that each have their own add, edit and delete.
const ITEM_TABS = ['interactions', 'pairings'];

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
  // Interactions and pairings are edited one by one, so their tabs only need Save and Cancel while the profile is
  // being edited.
  const showsEditButtons = !ITEM_TABS.includes(activeTab) || isEditMode;

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
