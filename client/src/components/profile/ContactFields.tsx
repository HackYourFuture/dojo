import { Box, Stack } from '@mui/material';
import { ChangeEvent, ReactNode } from 'react';
import { ProfileTextField, ProfileTextFieldProps } from './ProfileTextField';

import EmailIcon from '@mui/icons-material/EmailOutlined';
import { FieldRow } from './ProfileSection';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import PhoneIcon from '@mui/icons-material/Phone';
import { getSlackUserUrl } from '../../data/links';
import slackIcon from '../../assets/slack.png';

// The contact details of a person's profile.
interface ContactDetails {
  email: string;
  phone: string | null;
  slackId: string | null;
  githubHandle: string | null;
  linkedinUrl: string | null;
}

interface ContactFieldsProps {
  contact: ContactDetails;
  isEditing: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

type ContactFieldProps = Omit<ProfileTextFieldProps, 'sx'> & {
  icon: ReactNode;
};

/** A contact field with an icon in front of it. */
const ContactField = ({ icon, ...props }: ContactFieldProps) => (
  <Stack direction="row" spacing={1.5} sx={{ alignItems: 'flex-end' }}>
    {/* As tall as the input, with the icon on its middle, or on the line of the value when not editing. */}
    <Box
      sx={{
        display: 'flex',
        alignItems: props.isEditing ? 'center' : 'flex-start',
        height: 40,
        color: 'action.active',
      }}
    >
      {icon}
    </Box>
    <ProfileTextField {...props} sx={{ flex: 1, minWidth: 0 }} />
  </Stack>
);

/** The email, phone, Slack, GitHub and LinkedIn fields of a contact tab, each with its icon. */
export const ContactFields = ({ contact, isEditing, onChange }: ContactFieldsProps) => (
  <>
    <FieldRow fill>
      <ContactField
        icon={<EmailIcon />}
        name="email"
        label="Email"
        type="email"
        placeholder="john_doe@example.com"
        href={`mailto:${contact.email}`}
        value={contact.email}
        isEditing={isEditing}
        onChange={onChange}
      />
      <ContactField
        icon={<PhoneIcon />}
        name="phone"
        label="Phone"
        type="tel"
        placeholder="+1234567890"
        value={contact.phone}
        isEditing={isEditing}
        onChange={onChange}
      />
    </FieldRow>
    <FieldRow fill>
      <ContactField
        icon={<Box component="img" src={slackIcon} alt="" sx={{ width: 24, height: 24 }} />}
        name="slackId"
        label="Slack ID"
        placeholder="UXXXXXXXXXX"
        href={contact.slackId ? getSlackUserUrl(contact.slackId) : undefined}
        value={contact.slackId}
        isEditing={isEditing}
        onChange={onChange}
      />
      <ContactField
        icon={<GitHubIcon />}
        name="githubHandle"
        label="GitHub Handle"
        placeholder="john_doe"
        href={`https://github.com/${contact.githubHandle}`}
        value={contact.githubHandle}
        isEditing={isEditing}
        onChange={onChange}
      />
    </FieldRow>
    <FieldRow fill>
      <ContactField
        icon={<LinkedInIcon />}
        name="linkedinUrl"
        label="LinkedIn"
        type="url"
        placeholder="https://www.linkedin.com/in/john_doe"
        href={contact.linkedinUrl ?? undefined}
        value={contact.linkedinUrl}
        isEditing={isEditing}
        onChange={onChange}
      />
    </FieldRow>
  </>
);
