import { PROFILE_FIELD_GAP, ProfileSection } from './ProfileSection';

import { Box } from '@mui/material';
import { ChangeEvent } from 'react';
import MarkdownText from '../MarkdownText';
import { PROFILE_FIELD_WIDTH } from './fieldStyles';
import { ProfileTextField } from './ProfileTextField';

// As wide as a row of fields, so the notes do not stretch across a wide screen.
const ROW_WIDTH = `calc(4 * ${PROFILE_FIELD_WIDTH} + 3 * ${PROFILE_FIELD_GAP})`;

interface ProfileNotesProps {
  notes: string | null;
  isEditing: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

/** The notes section of a profile tab, written in Markdown and shown formatted. */
export const ProfileNotes = ({ notes, isEditing, onChange }: ProfileNotesProps) => (
  // The section title labels the field.
  <ProfileSection title="Notes">
    <Box sx={{ maxWidth: ROW_WIDTH }}>
      {isEditing || !notes ? (
        <ProfileTextField
          name="notes"
          multiline
          // At least two lines, so it looks like a field for more than one line.
          minRows={2}
          value={notes}
          isEditing={isEditing}
          onChange={onChange}
          sx={{ width: '100%' }}
          slotProps={{ htmlInput: { 'aria-label': 'Notes' } }}
        />
      ) : (
        <MarkdownText>{notes}</MarkdownText>
      )}
    </Box>
  </ProfileSection>
);
