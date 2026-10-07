import { Box, Button, Tabs } from '@mui/material';

import { ReactNode } from 'react';

interface ProfileTabBarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  // The Tab elements.
  children: ReactNode;
  isEditMode: boolean;
  isSaving: boolean;
  onClickEditButton: () => void;
  onCancel: () => void;
}

/** The tabs of a profile, with the Edit button, or Save and Cancel while editing, at the end of the bar. */
export const ProfileTabBar = ({
  activeTab,
  onTabChange,
  children,
  isEditMode,
  isSaving,
  onClickEditButton,
  onCancel,
}: ProfileTabBarProps) => {
  // Interactions are edited one by one, so their tab only needs Save and Cancel while the profile is being edited.
  const showsEditButtons = activeTab !== 'interactions' || isEditMode;

  return (
    // Keeps its height when the edit buttons are hidden.
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 2,
        minHeight: 56,
        borderBottom: 1,
        borderColor: 'divider',
      }}
    >
      {/* Sits on the bottom border of the tab bar, so the active tab line covers it. */}
      <Box sx={{ display: 'flex', alignSelf: 'flex-end', minWidth: 0 }}>
        <Tabs
          value={activeTab}
          onChange={(_, value) => onTabChange(value)}
          aria-label="Profile sections"
          variant="scrollable"
          scrollButtons="auto"
        >
          {children}
        </Tabs>
      </Box>
      {showsEditButtons && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', paddingY: 1, gap: 1 }}>
          {isEditMode && (
            <Button variant="outlined" disabled={isSaving} onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button variant="contained" loading={isSaving} onClick={onClickEditButton}>
            {isEditMode ? 'Save' : 'Edit'}
          </Button>
        </Box>
      )}
    </Box>
  );
};
