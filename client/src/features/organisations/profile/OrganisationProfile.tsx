import { Box, Snackbar, Stack, Tab, Tabs } from '@mui/material';
import {
  EDITABLE_ORGANISATION_FIELDS,
  EditableOrganisationField,
  Organisation,
  OrganisationChanges,
} from '../Organisation';
import { useEffect, useState } from 'react';

import { EditSaveButton } from '../../trainee-profile/profile/components/EditSaveButton';
import InteractionsInfo from '../../interactions/InteractionsInfo';
import { InteractionsTabLabel } from '../../interactions/components/InteractionsTabLabel';
import MuiAlert from '@mui/material/Alert';
import OrganisationHeader from './OrganisationHeader';
import OrganisationInfo from './OrganisationInfo';
import { useUpdateOrganisation } from '../data/mutations';

// Lists are compared by their items, and responsibles by id, as the edited ones come from the users list.
const comparableValue = (organisation: Organisation, field: EditableOrganisationField) => {
  if (field === 'responsibles') {
    return organisation.responsibles.map((responsible) => responsible.id).join();
  }
  const value = organisation[field];
  return Array.isArray(value) ? value.join() : value;
};

// The fields that were changed while editing, with their new values.
const getChangedFields = (original: Organisation, edited: Organisation): OrganisationChanges => {
  const changedFields = EDITABLE_ORGANISATION_FIELDS.filter(
    (field) => comparableValue(original, field) !== comparableValue(edited, field)
  );
  return Object.fromEntries(changedFields.map((field) => [field, edited[field]]));
};

interface OrganisationProfileProps {
  organisation: Organisation;
}

/** The organisation profile: the header, the tabs and the content of the active tab. */
const OrganisationProfile = ({ organisation }: OrganisationProfileProps) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditMode, setIsEditMode] = useState(false);
  // A copy of the organisation with the changes made while editing.
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
      onSuccess: () => {
        setSnackbarSeverity('success');
        setSnackbarMessage('Organisation data saved successfully');
        setSnackbarOpen(true);
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
      // A colleague's change may have been loaded since the page opened, so start from the latest data.
      setEditedOrganisation(organisation);
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
  };

  // Interactions are edited one by one, so their tab only needs Save and Cancel while the profile is being edited.
  const showsEditButtons = activeTab !== 'interactions' || isEditMode;

  return (
    // The tabs have no padding of their own, so everything lines up with the header.
    <Box sx={{ paddingX: 8, bgcolor: 'background.default' }}>
      <Stack spacing={1} useFlexGap sx={{ paddingTop: 3 }}>
        <OrganisationHeader organisation={organisation} />
        {/* Keeps its height when the edit buttons are hidden. */}
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
              onChange={(_, value) => setActiveTab(value)}
              aria-label="Profile sections"
              variant="scrollable"
              scrollButtons="auto"
            >
              <Tab label="Overview" value="overview" />
              <Tab
                label={<InteractionsTabLabel profileType="organisation" profileId={organisation.id} />}
                value="interactions"
              />
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

      <Box sx={{ paddingY: 3 }}>
        {activeTab === 'overview' && (
          <OrganisationInfo
            organisation={isEditMode ? editedOrganisation : organisation}
            setOrganisation={setEditedOrganisation}
            isEditing={isEditMode}
          />
        )}
        {activeTab === 'interactions' && <InteractionsInfo profileType="organisation" profileId={organisation.id} />}
      </Box>
    </Box>
  );
};

export default OrganisationProfile;
