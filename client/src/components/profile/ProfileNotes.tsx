import { PROFILE_FIELD_GAP, ProfileSection } from './ProfileSection';

import { Box } from '@mui/material';
import { ChangeEvent } from 'react';
import { MarkdownField } from '../markdown/MarkdownField';
import MarkdownText from '../markdown/MarkdownText';
import { PROFILE_FIELD_WIDTH } from './fieldStyles';
import { ProfileValue } from './ProfileValue';

// As wide as a row of fields, so the notes do not stretch across a wide screen.
const ROW_WIDTH = `calc(4 * ${PROFILE_FIELD_WIDTH} + 3 * ${PROFILE_FIELD_GAP})`;

interface ProfileNotesProps {
  // The section title, which also labels the field.
  title: string;
  name: string;
  value: string | null;
  isEditing: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

/** A section of a profile tab with a text written in Markdown and shown formatted, like the notes. */
export const ProfileNotes = ({ title, name, value, isEditing, onChange }: ProfileNotesProps) => (
  <ProfileSection title={title}>
    <Box sx={{ maxWidth: ROW_WIDTH }}>
      {isEditing ? (
        <MarkdownField name={name} aria-label={title} value={value ?? ''} onChange={onChange} />
      ) : value ? (
        <MarkdownText>{value}</MarkdownText>
      ) : (
        <ProfileValue value={null} />
      )}
    </Box>
  </ProfileSection>
);
