import { Box, Chip, FormControl, FormHelperText, Stack, Tooltip } from '@mui/material';
import { MentorshipType, mentorshipTypeOptions } from '../MentorshipType';

import { DropdownSelect } from '../../../components/DropdownSelect';
import { FIELD_REQUIRED_ERROR } from '../../../data/text';
import { FormDateField } from '../../../components/FormDateField';
import { FormDialog } from '../../../components/FormDialog';
import { TraineeAutocomplete } from '../../trainees/components/TraineeAutocomplete';
import { TraineeReference } from '../../../data/types/Trainee';
import { VolunteerAutocomplete } from '../../volunteers/components/VolunteerAutocomplete';
import { VolunteerReference } from '../../volunteers/Volunteer';
import { addDays, formatDateForDisplay, today } from '../../../data/dates';
import { useCreateMentorship } from '../data/mutations';
import { useState } from 'react';

// The next check-in shortcuts, in days after the start date.
const NEXT_CHECKIN_SHORTCUTS = [7, 14, 30];

// The fields of the dialog, empty until they are filled in.
interface MentorshipForm {
  volunteer: VolunteerReference | null;
  trainee: TraineeReference | null;
  type: MentorshipType | null;
  startDate: Date | null;
  endDate: Date | null;
  nextCheckinDate: Date | null;
}

type FormErrors = Partial<Record<'volunteer' | 'trainee' | 'type' | 'startDate', string>>;

// A function, so the start date is the day the dialog opens, not the day the page loaded.
const newMentorshipForm = (): MentorshipForm => ({
  volunteer: null,
  trainee: null,
  type: null,
  startDate: today(),
  endDate: null,
  nextCheckinDate: null,
});

// The errors of the fields that fail, or null when the form can be sent.
const getFormErrors = (form: MentorshipForm): FormErrors | null => {
  const errors: FormErrors = {};
  if (!form.volunteer) {
    errors.volunteer = FIELD_REQUIRED_ERROR;
  }
  if (!form.trainee) {
    errors.trainee = FIELD_REQUIRED_ERROR;
  }
  if (!form.type) {
    errors.type = FIELD_REQUIRED_ERROR;
  }
  if (!form.startDate) {
    errors.startDate = FIELD_REQUIRED_ERROR;
  }
  return Object.keys(errors).length > 0 ? errors : null;
};

interface AddMentorshipDialogProps {
  isOpen: boolean;
  handleClose: () => void;
}

/** The dialog to pair a volunteer with a trainee. The page mounts it again on every open, which resets it. */
export const AddMentorshipDialog = ({ isOpen, handleClose }: AddMentorshipDialogProps) => {
  const { mutate: createMentorship, isPending, error: submitError } = useCreateMentorship();
  const [form, setForm] = useState<MentorshipForm>(newMentorshipForm);
  const [errors, setErrors] = useState<FormErrors | null>(null);
  // The date field keeps what it shows itself, so a shortcut mounts it again with a new key to show its date.
  const [nextCheckinFieldKey, setNextCheckinFieldKey] = useState(0);

  // Sets a field and clears its error, if it had one.
  const setField = <K extends keyof MentorshipForm>(name: K, value: MentorshipForm[K]) => {
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
    setErrors((prevErrors) => (prevErrors ? { ...prevErrors, [name]: undefined } : null));
  };

  // That many days after the start date, or after today while the start date is empty.
  const shortcutDate = (days: number) => addDays(form.startDate ?? today(), days);

  const applyShortcut = (days: number) => {
    setField('nextCheckinDate', shortcutDate(days));
    setNextCheckinFieldKey((key) => key + 1);
  };

  const handleSubmit = () => {
    // The server checks the end date against the start date, and its message is shown below the form.
    const formErrors = getFormErrors(form);
    setErrors(formErrors);
    // Checked again only so TypeScript knows the required fields are set.
    if (formErrors || !form.volunteer || !form.trainee || !form.type || !form.startDate) {
      return;
    }
    const newMentorship = {
      volunteerId: form.volunteer.id,
      traineeId: form.trainee.id,
      type: form.type,
      startDate: form.startDate,
      endDate: form.endDate,
      nextCheckinDate: form.nextCheckinDate,
    };
    createMentorship(newMentorship, { onSuccess: handleClose });
  };

  return (
    <FormDialog
      isOpen={isOpen}
      title="New mentorship"
      submitLabel="Create"
      isSaving={isPending}
      error={submitError && `An error occurred while creating the mentorship: ${submitError.message || 'unknown'}`}
      onClose={handleClose}
      onSubmit={handleSubmit}
    >
      <VolunteerAutocomplete
        label="Mentor"
        value={form.volunteer}
        error={errors?.volunteer}
        disabled={isPending}
        onChange={(volunteer) => setField('volunteer', volunteer)}
      />
      <TraineeAutocomplete
        label="Trainee"
        value={form.trainee}
        error={errors?.trainee}
        disabled={isPending}
        onChange={(trainee) => setField('trainee', trainee)}
      />
      {/* The required fields first. Aligned to the top, so an error message under one field does not stretch the other. */}
      <Stack direction="row" spacing={2} sx={{ alignItems: 'flex-start' }}>
        <Box sx={{ flex: 1 }}>
          <DropdownSelect
            id="mentorshipType"
            name="type"
            label="Type"
            options={mentorshipTypeOptions}
            disabled={isPending}
            value={form.type ?? undefined}
            error={errors?.type}
            width="100%"
            onChange={(event) => setField('type', event.target.value as MentorshipType)}
          />
        </Box>
        <FormControl sx={{ flex: 1 }}>
          <FormDateField
            disabled={isPending}
            label="Start date"
            value={form.startDate}
            error={!!errors?.startDate}
            onChange={(date) => setField('startDate', date)}
          />
          {errors?.startDate && <FormHelperText error>{errors.startDate}</FormHelperText>}
        </FormControl>
      </Stack>
      <Stack direction="row" spacing={2} sx={{ alignItems: 'flex-start' }}>
        <FormControl sx={{ flex: 1 }}>
          <FormDateField
            disabled={isPending}
            label="End date"
            value={form.endDate}
            clearable
            onChange={(date) => setField('endDate', date)}
          />
        </FormControl>
        <FormControl sx={{ flex: 1 }}>
          <FormDateField
            key={nextCheckinFieldKey}
            disabled={isPending}
            label="Next check-in date"
            value={form.nextCheckinDate}
            clearable
            onChange={(date) => setField('nextCheckinDate', date)}
          />
          <Stack direction="row" spacing={1} sx={{ pt: 1 }}>
            {NEXT_CHECKIN_SHORTCUTS.map((days) => (
              // The date describes the chip, so a screen reader still says "+7d" as its name.
              <Tooltip key={days} title={formatDateForDisplay(shortcutDate(days))} placement="bottom" describeChild>
                <Chip
                  label={`+${days}d`}
                  size="small"
                  variant="outlined"
                  disabled={isPending}
                  onClick={() => applyShortcut(days)}
                />
              </Tooltip>
            ))}
          </Stack>
        </FormControl>
      </Stack>
    </FormDialog>
  );
};
