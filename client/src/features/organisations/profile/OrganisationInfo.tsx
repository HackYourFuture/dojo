import { Dispatch, SetStateAction } from 'react';
import { FieldRow, PROFILE_DOUBLE_FIELD_WIDTH, ProfileSection } from '../../../components/profile/ProfileSection';
import { Organisation, PartnershipType, Responsible } from '../Organisation';

import { ContactPersons } from '../contact-persons/ContactPersons';
import { ProfileMultiSelect } from './ProfileMultiSelect';
import { ProfileNotes } from '../../../components/profile/ProfileNotes';
import { ProfileSelect } from '../../../components/profile/ProfileSelect';
import { ProfileTextField } from '../../../components/profile/ProfileTextField';
import { ProfileUserPicker } from './ProfileUserPicker';
import { Stack } from '@mui/material';
import { createFieldChangeHandlers } from '../../../components/profile/fieldChangeHandlers';
import { organisationStatusOptions } from '../utils/organisationStatus';
import { partnershipTypeLabels } from '../utils/partnershipTypes';

// The rows are four fields wide, and a wide field takes two of them, so the fields line up in columns.
const doubleFieldStyle = { width: PROFILE_DOUBLE_FIELD_WIDTH };

interface OrganisationInfoProps {
  organisation: Organisation;
  setOrganisation: Dispatch<SetStateAction<Organisation>>;
  isEditing: boolean;
}

/** The overview tab: the details and notes, edited with the profile, and the contacts, managed on their own. */
const OrganisationInfo = ({ organisation, setOrganisation, isEditing }: OrganisationInfoProps) => {
  const { handleValueChange, handleTextChange } = createFieldChangeHandlers(setOrganisation);

  // Kept in the order the server sorts them, so picking them in another order is not a change.
  const handlePartnershipTypesChange = (partnershipTypes: PartnershipType[]) => {
    setOrganisation((prevOrganisation) => ({
      ...prevOrganisation,
      partnershipTypes: Object.values(PartnershipType).filter((type) => partnershipTypes.includes(type)),
    }));
  };

  const handleResponsiblesChange = (responsibles: Responsible[]) => {
    setOrganisation((prevOrganisation) => ({ ...prevOrganisation, responsibles }));
  };

  return (
    <Stack spacing={4} useFlexGap>
      <ProfileSection>
        <FieldRow>
          <ProfileTextField
            name="name"
            label="Name"
            placeholder="Acme B.V."
            value={organisation.name}
            isEditing={isEditing}
            onChange={handleTextChange}
            sx={doubleFieldStyle}
          />
          <ProfileSelect
            name="status"
            label="Status"
            options={organisationStatusOptions}
            value={organisation.status}
            isEditing={isEditing}
            onChange={handleValueChange}
          />
          <ProfileTextField
            name="location"
            label="Location"
            placeholder="Amsterdam"
            value={organisation.location}
            isEditing={isEditing}
            onChange={handleTextChange}
          />
        </FieldRow>
        <FieldRow>
          <ProfileMultiSelect
            name="partnershipTypes"
            label="Partnership types"
            options={Object.values(PartnershipType)}
            value={organisation.partnershipTypes}
            getOptionLabel={(type) => partnershipTypeLabels[type]}
            isEditing={isEditing}
            onChange={handlePartnershipTypesChange}
            sx={doubleFieldStyle}
          />
          <ProfileUserPicker
            name="responsibles"
            label="Responsible"
            value={organisation.responsibles}
            isEditing={isEditing}
            onChange={handleResponsiblesChange}
            sx={doubleFieldStyle}
          />
        </FieldRow>
        <FieldRow>
          <ProfileTextField
            name="websiteUrl"
            label="Website"
            type="url"
            placeholder="https://example.com"
            href={organisation.websiteUrl ?? undefined}
            value={organisation.websiteUrl}
            isEditing={isEditing}
            onChange={handleTextChange}
            sx={doubleFieldStyle}
          />
          <ProfileTextField
            name="linkedinUrl"
            label="LinkedIn"
            type="url"
            placeholder="https://www.linkedin.com/company/example"
            href={organisation.linkedinUrl ?? undefined}
            value={organisation.linkedinUrl}
            isEditing={isEditing}
            onChange={handleTextChange}
            sx={doubleFieldStyle}
          />
        </FieldRow>
      </ProfileSection>

      <ContactPersons organisationId={organisation.id} />

      <ProfileNotes notes={organisation.notes} isEditing={isEditing} onChange={handleTextChange} />
    </Stack>
  );
};

export default OrganisationInfo;
