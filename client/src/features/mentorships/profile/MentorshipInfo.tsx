import { Dispatch, SetStateAction, useState } from 'react';
import { FieldRow, PROFILE_DOUBLE_FIELD_WIDTH, ProfileSection } from '../../../components/profile/ProfileSection';
import { Link, Stack } from '@mui/material';
import { formatDate, today } from '../../../data/dates';

import { EditedMentorship } from '../Mentorship';
import { NextCheckinShortcuts } from '../components/NextCheckinShortcuts';
import { ProfileDateField } from '../../../components/profile/ProfileDateField';
import { ProfileSelect } from '../../../components/profile/ProfileSelect';
import { ProfileValue } from '../../../components/profile/ProfileValue';
import { Link as RouterLink } from 'react-router';
import { TraineeReference } from '../../../data/types/Trainee';
import { VolunteerReference } from '../../volunteers/Volunteer';
import { createFieldChangeHandlers } from '../../../components/profile/fieldChangeHandlers';
import { mentorshipTypeOptions } from '../MentorshipType';

// The rows are four fields wide, and a wide field takes two of them, so the fields line up in columns.
const doubleFieldStyle = { width: PROFILE_DOUBLE_FIELD_WIDTH };

interface PersonNameProps {
  person: VolunteerReference | TraineeReference;
}

// The name, which opens the person's profile. Without the picture, which the header already shows.
const PersonName = ({ person }: PersonNameProps) => (
  <Link component={RouterLink} to={person.profilePath} color="textPrimary">
    {person.name}
  </Link>
);

interface MentorshipInfoProps {
  mentorship: EditedMentorship;
  setMentorship: Dispatch<SetStateAction<EditedMentorship>>;
  isEditing: boolean;
}

/** The details: the mentor and the trainee, which are fixed, and the type and the dates, edited with the profile. */
const MentorshipInfo = ({ mentorship, setMentorship, isEditing }: MentorshipInfoProps) => {
  const { handleValueChange } = createFieldChangeHandlers(setMentorship);
  // The date field keeps what it shows itself, so a shortcut mounts it again with a new key to show its date.
  const [nextCheckinFieldKey, setNextCheckinFieldKey] = useState(0);

  // The date field works in YYYY-MM-DD, and the mentorship in dates at midnight UTC, which is how new Date reads it.
  const handleDateChange = (name: string, value: string | null) => {
    setMentorship((prevMentorship) => ({ ...prevMentorship, [name]: value ? new Date(value) : null }));
  };

  const applyShortcut = (date: Date) => {
    setMentorship((prevMentorship) => ({ ...prevMentorship, nextCheckinDate: date }));
    setNextCheckinFieldKey((key) => key + 1);
  };

  return (
    <ProfileSection>
      <FieldRow>
        <ProfileValue label="Mentor" value={<PersonName person={mentorship.volunteer} />} sx={doubleFieldStyle} />
        <ProfileValue label="Trainee" value={<PersonName person={mentorship.trainee} />} sx={doubleFieldStyle} />
      </FieldRow>
      <FieldRow>
        <ProfileSelect
          name="type"
          label="Type"
          options={mentorshipTypeOptions}
          value={mentorship.type}
          isEditing={isEditing}
          onChange={handleValueChange}
        />
        <ProfileDateField
          name="startDate"
          label="Start date"
          value={formatDate(mentorship.startDate)}
          isEditing={isEditing}
          onChange={handleDateChange}
        />
        <ProfileDateField
          name="endDate"
          label="End date"
          value={formatDate(mentorship.endDate)}
          isEditing={isEditing}
          onChange={handleDateChange}
        />
        <Stack>
          <ProfileDateField
            key={nextCheckinFieldKey}
            name="nextCheckinDate"
            label="Next check-in date"
            value={formatDate(mentorship.nextCheckinDate)}
            isEditing={isEditing}
            onChange={handleDateChange}
          />
          {/* Counted from today, as the start date is usually long past when the next check-in is planned. */}
          {isEditing && <NextCheckinShortcuts from={today()} onPick={applyShortcut} />}
        </Stack>
      </FieldRow>
    </ProfileSection>
  );
};

export default MentorshipInfo;
