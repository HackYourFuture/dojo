import { ChangeEvent, Dispatch, SetStateAction } from 'react';
import { FieldRow, ProfileSection } from '../../trainee-profile/profile/components/ProfileSection';
import { Organisation, PartnershipType, Responsible } from '../Organisation';

import { ContactPersons } from '../contact-persons/ContactPersons';
import MarkdownText from '../../trainee-profile/components/MarkdownText';
import { ProfileMultiSelect } from '../../trainee-profile/profile/components/ProfileMultiSelect';
import { ProfileSelect } from '../../trainee-profile/profile/components/ProfileSelect';
import { ProfileTextField } from '../../trainee-profile/profile/components/ProfileTextField';
import { ProfileUserPicker } from '../../trainee-profile/profile/components/ProfileUserPicker';
import { Stack } from '@mui/material';
import { organisationStatusOptions } from '../utils/organisationStatus';
import { partnershipTypeLabels } from '../utils/partnershipTypes';

interface OrganisationInfoProps {
  organisation: Organisation;
  setOrganisation: Dispatch<SetStateAction<Organisation>>;
  isEditing: boolean;
}

/** The organisation tab: the details and notes, edited with the profile, and the contacts, managed on their own. */
const OrganisationInfo = ({ organisation, setOrganisation, isEditing }: OrganisationInfoProps) => {
  // The dropdown reports its value instead of an event.
  const handleValueChange = (name: string, value: string | boolean | null) => {
    setOrganisation((prevOrganisation) => ({ ...prevOrganisation, [name]: value }));
  };

  const handleTextChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    handleValueChange(event.target.name, event.target.value);
  };

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
        <FieldRow fill>
          <ProfileMultiSelect
            name="partnershipTypes"
            label="Partnership types"
            options={Object.values(PartnershipType)}
            value={organisation.partnershipTypes}
            getOptionLabel={(type) => partnershipTypeLabels[type]}
            isEditing={isEditing}
            onChange={handlePartnershipTypesChange}
          />
          <ProfileUserPicker
            name="responsibles"
            label="Responsible"
            value={organisation.responsibles}
            isEditing={isEditing}
            onChange={handleResponsiblesChange}
          />
        </FieldRow>
        <FieldRow fill>
          <ProfileTextField
            name="websiteUrl"
            label="Website"
            type="url"
            placeholder="https://example.com"
            href={organisation.websiteUrl ?? undefined}
            value={organisation.websiteUrl}
            isEditing={isEditing}
            onChange={handleTextChange}
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
          />
        </FieldRow>
      </ProfileSection>

      <ContactPersons organisationId={organisation.id} />

      {/* The section title labels the field. The notes are written in Markdown, and shown formatted. */}
      <ProfileSection title="Notes">
        {isEditing || !organisation.notes ? (
          <ProfileTextField
            name="notes"
            multiline
            value={organisation.notes}
            isEditing={isEditing}
            onChange={handleTextChange}
            sx={{ width: '100%' }}
            slotProps={{ htmlInput: { 'aria-label': 'Notes' } }}
          />
        ) : (
          <MarkdownText>{organisation.notes}</MarkdownText>
        )}
      </ProfileSection>
    </Stack>
  );
};

export default OrganisationInfo;
