import { Box, Stack } from '@mui/material';
import { ChangeEvent, Dispatch, SetStateAction } from 'react';
import {
  FieldRow,
  PROFILE_DOUBLE_FIELD_WIDTH,
  PROFILE_FIELD_GAP,
  ProfileSection,
} from '../../trainee-profile/profile/components/ProfileSection';
import { Organisation, PartnershipType, Responsible } from '../Organisation';

import { ContactPersons } from '../contact-persons/ContactPersons';
import MarkdownText from '../../trainee-profile/components/MarkdownText';
import { PROFILE_FIELD_WIDTH } from '../../trainee-profile/profile/components/fieldStyles';
import { ProfileMultiSelect } from '../../trainee-profile/profile/components/ProfileMultiSelect';
import { ProfileSelect } from '../../trainee-profile/profile/components/ProfileSelect';
import { ProfileTextField } from '../../trainee-profile/profile/components/ProfileTextField';
import { ProfileUserPicker } from '../../trainee-profile/profile/components/ProfileUserPicker';
import { organisationStatusOptions } from '../utils/organisationStatus';
import { partnershipTypeLabels } from '../utils/partnershipTypes';

// The rows are four fields wide, and a wide field takes two of them, so the fields line up in columns.
const doubleFieldStyle = { width: PROFILE_DOUBLE_FIELD_WIDTH };

// As wide as a row of fields, so the notes do not stretch across a wide screen.
const ROW_WIDTH = `calc(4 * ${PROFILE_FIELD_WIDTH} + 3 * ${PROFILE_FIELD_GAP})`;

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

      {/* The section title labels the field. The notes are written in Markdown, and shown formatted. */}
      <ProfileSection title="Notes">
        <Box sx={{ maxWidth: ROW_WIDTH }}>
          {isEditing || !organisation.notes ? (
            <ProfileTextField
              name="notes"
              multiline
              // At least two lines, so it looks like a field for more than one line.
              minRows={2}
              value={organisation.notes}
              isEditing={isEditing}
              onChange={handleTextChange}
              sx={{ width: '100%' }}
              slotProps={{ htmlInput: { 'aria-label': 'Notes' } }}
            />
          ) : (
            <MarkdownText>{organisation.notes}</MarkdownText>
          )}
        </Box>
      </ProfileSection>
    </Stack>
  );
};

export default OrganisationInfo;
