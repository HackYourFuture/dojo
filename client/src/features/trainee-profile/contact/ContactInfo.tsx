import { Box, Stack } from '@mui/material';
import { FieldRow, ProfileSection } from '../profile/components/ProfileSection';
import { ProfileTextField, ProfileTextFieldProps } from '../profile/components/ProfileTextField';

import EmailIcon from '@mui/icons-material/EmailOutlined';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import PhoneIcon from '@mui/icons-material/Phone';
import { ReactNode } from 'react';
import { createTextChangeHandler } from '../utils/formHelper';
import { getSlackUserUrl } from '../../../data/links';
import slackIcon from '../../../assets/slack.png';
import { useTraineeProfileContext } from '../context/useTraineeProfileContext';

type ContactFieldProps = Omit<ProfileTextFieldProps, 'sx'> & {
  icon: ReactNode;
};

/**
 * A contact field with an icon in front of it.
 */
const ContactField = ({ icon, ...props }: ContactFieldProps) => (
  <Stack direction="row" alignItems="flex-end" spacing={1.5}>
    {/* As tall as the input, with the icon on its middle, or on the line of the value when not editing. */}
    <Box display="flex" alignItems={props.isEditing ? 'center' : 'flex-start'} height={40} color="action.active">
      {icon}
    </Box>
    <ProfileTextField {...props} sx={{ flex: 1, minWidth: 0 }} />
  </Stack>
);

/**
 * Component for displaying contact information in trainee profile data on the contact tab.
 *
 * @returns {ReactNode} A React element that renders trainee contact information with view, add, and edit logic.
 */
const ContactInfo = () => {
  const { trainee, setTrainee, isEditMode: isEditing } = useTraineeProfileContext();
  const { contactInfo: editedFields } = trainee;

  const handleTextChange = createTextChangeHandler(setTrainee, 'contactInfo');

  return (
    <Stack spacing={4} useFlexGap>
      <ProfileSection>
        <FieldRow fill>
          <ContactField
            icon={<EmailIcon />}
            name="email"
            label="Email"
            type="email"
            placeholder="john_doe@example.com"
            href={`mailto:${editedFields.email}`}
            value={editedFields.email}
            isEditing={isEditing}
            onChange={handleTextChange}
          />
          <ContactField
            icon={<PhoneIcon />}
            name="phone"
            label="Phone"
            type="tel"
            placeholder="+1234567890"
            value={editedFields.phone}
            isEditing={isEditing}
            onChange={handleTextChange}
          />
        </FieldRow>
        <FieldRow fill>
          <ContactField
            icon={<Box component="img" src={slackIcon} alt="" width={24} height={24} />}
            name="slackId"
            label="Slack ID"
            placeholder="UXXXXXXXXXX"
            href={editedFields.slackId ? getSlackUserUrl(editedFields.slackId) : undefined}
            value={editedFields.slackId}
            isEditing={isEditing}
            onChange={handleTextChange}
          />
          <ContactField
            icon={<GitHubIcon />}
            name="githubHandle"
            label="GitHub Handle"
            placeholder="john_doe"
            href={`https://github.com/${editedFields.githubHandle}`}
            value={editedFields.githubHandle}
            isEditing={isEditing}
            onChange={handleTextChange}
          />
        </FieldRow>
        <FieldRow fill>
          <ContactField
            icon={<LinkedInIcon />}
            name="linkedinUrl"
            label="LinkedIn"
            type="url"
            placeholder="https://www.linkedin.com/in/john_doe"
            href={editedFields.linkedinUrl ?? undefined}
            value={editedFields.linkedinUrl}
            isEditing={isEditing}
            onChange={handleTextChange}
          />
        </FieldRow>
      </ProfileSection>

      <ProfileSection title="Emergency contact">
        <FieldRow fill>
          <ProfileTextField
            name="emergencyContactName"
            label="Name"
            placeholder="Steve Doe"
            value={editedFields.emergencyContactName}
            isEditing={isEditing}
            onChange={handleTextChange}
          />
          <ProfileTextField
            name="emergencyContactRelationship"
            label="Relationship"
            placeholder="Sister"
            value={editedFields.emergencyContactRelationship}
            isEditing={isEditing}
            onChange={handleTextChange}
          />
          <ProfileTextField
            name="emergencyContactPhone"
            label="Phone"
            type="tel"
            placeholder="+1234567890"
            value={editedFields.emergencyContactPhone}
            isEditing={isEditing}
            onChange={handleTextChange}
          />
        </FieldRow>
      </ProfileSection>
    </Stack>
  );
};

export default ContactInfo;
