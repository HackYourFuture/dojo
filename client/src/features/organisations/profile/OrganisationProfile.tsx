import { Box, Stack, Tab } from '@mui/material';
import {
  EDITABLE_ORGANISATION_FIELDS,
  EditableOrganisationField,
  Organisation,
  OrganisationChanges,
} from '../Organisation';

import InteractionsInfo from '../../interactions/InteractionsInfo';
import { InteractionsTabLabel } from '../../interactions/components/InteractionsTabLabel';
import { OrganisationActions } from './OrganisationActions';
import OrganisationHeader from './OrganisationHeader';
import OrganisationInfo from './OrganisationInfo';
import { ProfileButtons } from '../../../components/profile/ProfileButtons';
import { ProfileTabBar } from '../../../components/profile/ProfileTabBar';
import { usePageTitle } from '../../../hooks/usePageTitle';
import { useProfileSave } from '../../../hooks/useProfileSave';
import { useProfileTab } from '../../../hooks/useProfileTab';
import { useState } from 'react';
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

// The open tab is in the URL, and Slack links to the interactions tab by name.
const TABS = ['overview', 'interactions'];

interface OrganisationProfileProps {
  organisation: Organisation;
}

/** The organisation profile: the header, the tabs and the content of the active tab. */
const OrganisationProfile = ({ organisation }: OrganisationProfileProps) => {
  const [activeTab, setActiveTab] = useProfileTab(organisation.profilePath, TABS);
  const [isEditMode, setIsEditMode] = useState(false);
  // A copy of the organisation with the changes made while editing.
  const [editedOrganisation, setEditedOrganisation] = useState<Organisation>(organisation);
  const { isPending: isSaveLoading, mutate: updateOrganisation } = useUpdateOrganisation(organisation.id);

  const { saveChanges, saveResultSnackbar } = useProfileSave('Organisation', updateOrganisation);
  usePageTitle(organisation.name);

  // Starts editing, or saves the changes while editing.
  const onClickEditButton = () => {
    if (!isEditMode) {
      // A colleague's change may have been loaded since the page opened, so start from the latest data.
      setEditedOrganisation(organisation);
      setIsEditMode(true);
      return;
    }

    saveChanges(getChangedFields(organisation, editedOrganisation), () => setIsEditMode(false));
  };

  // Stops editing and drops the changes.
  const onCancelEdit = () => {
    setIsEditMode(false);
  };

  return (
    // The tabs have no padding of their own, so everything lines up with the header.
    <Box sx={{ paddingX: 8, bgcolor: 'background.default' }}>
      <Stack spacing={1} useFlexGap sx={{ paddingTop: 3 }}>
        <OrganisationHeader organisation={organisation}>
          <ProfileButtons
            activeTab={activeTab}
            isEditMode={isEditMode}
            isSaving={isSaveLoading}
            onClickEditButton={onClickEditButton}
            onCancel={onCancelEdit}
            actions={<OrganisationActions organisationId={organisation.id} name={organisation.name} />}
          />
        </OrganisationHeader>
        <ProfileTabBar activeTab={activeTab} onTabChange={setActiveTab}>
          <Tab label="Overview" value="overview" />
          <Tab
            label={<InteractionsTabLabel profileType="organisation" profileId={organisation.id} />}
            value="interactions"
          />
        </ProfileTabBar>
      </Stack>
      {saveResultSnackbar}

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
