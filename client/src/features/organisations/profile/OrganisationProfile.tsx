import { Box, Snackbar, Stack, Tab, Tabs } from '@mui/material';
import { EDITABLE_ORGANISATION_FIELDS, Organisation, OrganisationChanges } from '../Organisation';
import { useEffect, useState } from 'react';

import { EditSaveButton } from '../../trainee-profile/profile/components/EditSaveButton';
import MuiAlert from '@mui/material/Alert';
import OrganisationHeader from './OrganisationHeader';
import OrganisationInfo from './OrganisationInfo';
import { useUpdateOrganisation } from '../data/mutations';

// The fields that were changed while editing, with their new values.
const getChangedFields = (original: Organisation, edited: Organisation): OrganisationChanges => {
  const changedFields = EDITABLE_ORGANISATION_FIELDS.filter((field) => original[field] !== edited[field]);
  return Object.fromEntries(changedFields.map((field) => [field, edited[field]]));
};

interface OrganisationProfileProps {
  organisation: Organisation;
}

/** The organisation profile: the header, the tabs and the content of the active tab. */
const OrganisationProfile = ({ organisation }: OrganisationProfileProps) => {
  const [activeTab, setActiveTab] = useState('organisation');
  const [isEditMode, setIsEditMode] = useState(false);
  // The organisation with the changes made while editing.
  const [editedOrganisation, setEditedOrganisation] = useState<Organisation>(organisation);
  const { isPending: isSaveLoading, mutate: updateOrganisation } = useUpdateOrganisation(organisation.id);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    document.title = `${organisation.name} | Dojo`;
  }, [organisation.name]);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  // Saves the changes and shows the result in a snackbar.
  const saveOrganisation = (changes: OrganisationChanges) => {
    updateOrganisation(changes, {
      onSuccess: (updatedOrganisation) => {
        setSnackbarSeverity('success');
        setSnackbarMessage('Organisation data saved successfully');
        setSnackbarOpen(true);
        setEditedOrganisation(updatedOrganisation);
        setIsEditMode(false);
      },
      onError: (error) => {
        console.error('There was a problem saving organisation data:', error.message);
        // The server validates the whole organisation, so its message names the field that blocks the save.
        setSnackbarSeverity('error');
        setSnackbarMessage(`Error saving organisation data: ${error.message}`);
        setSnackbarOpen(true);
      },
    });
  };

  // Starts editing, or saves the changes while editing.
  const onClickEditButton = () => {
    if (!isEditMode) {
      setIsEditMode(true);
      return;
    }

    const changes = getChangedFields(organisation, editedOrganisation);
    // Nothing to save, and the API rejects an update without fields.
    if (Object.keys(changes).length === 0) {
      setIsEditMode(false);
      return;
    }
    saveOrganisation(changes);
  };

  // Stops editing and drops the changes.
  const onCancelEdit = () => {
    setIsEditMode(false);
    setEditedOrganisation(organisation);
  };

  // The interactions tab has nothing to edit, so it only needs Save and Cancel while the profile is being edited.
  const showsEditButtons = activeTab !== 'interactions' || isEditMode;

  return (
    // The tabs have no padding of their own, so everything lines up with the header.
    <Box paddingX={8} bgcolor="background.default">
      <Stack spacing={1} useFlexGap paddingTop={3}>
        <OrganisationHeader organisation={organisation} />
        {/* Keeps its height when the edit buttons are hidden. */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          flexWrap="wrap"
          gap={2}
          minHeight={56}
          borderBottom={1}
          borderColor="divider"
        >
          {/* Sits on the bottom border of the tab bar, so the active tab line covers it. */}
          <Box display="flex" alignSelf="flex-end" minWidth={0}>
            <Tabs
              value={activeTab}
              onChange={(_, value) => setActiveTab(value)}
              aria-label="Profile sections"
              variant="scrollable"
              scrollButtons="auto"
            >
              <Tab label="Organisation" value="organisation" />
              <Tab label="Interactions" value="interactions" />
            </Tabs>
          </Box>
          {showsEditButtons && (
            <EditSaveButton
              isEditMode={isEditMode}
              isLoading={isSaveLoading}
              onCancel={onCancelEdit}
              onClickEditButton={onClickEditButton}
            />
          )}
        </Box>
      </Stack>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <MuiAlert elevation={6} variant="filled" onClose={handleSnackbarClose} severity={snackbarSeverity}>
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>

      {/* The interactions are not built yet, so their tab is empty. */}
      <Box paddingY={3}>
        {activeTab === 'organisation' && (
          <OrganisationInfo
            organisation={editedOrganisation}
            setOrganisation={setEditedOrganisation}
            isEditing={isEditMode}
          />
        )}
      </Box>
    </Box>
  );
};

export default OrganisationProfile;
