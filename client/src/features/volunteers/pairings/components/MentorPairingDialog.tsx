import { Chip, FormControl, FormHelperText, Stack, Tooltip } from '@mui/material';
import { MentorPairingType, mentorPairingTypeLabels } from '../MentorPairingType';
import { ReactNode, useState } from 'react';
import { addDays, daysFromToday, formatDateForDisplay, today } from '../../../../data/dates';

import { DropdownSelect } from '../../../../components/DropdownSelect';
import { FIELD_REQUIRED_ERROR } from '../../../../data/text';
import { FormDateField } from '../../../../components/FormDateField';
import { FormDialog } from '../../../../components/FormDialog';
import { MentorPairing } from '../MentorPairing';
import { TraineeAutocomplete } from '../../../trainees/components/TraineeAutocomplete';
import { TraineeReference } from '../../../../data/types/Trainee';

// The quick picks for the next check-in, in days after the last one.
const NEXT_CHECKIN_SHORTCUTS = [7, 15, 30];

const typeOptions = Object.values(MentorPairingType).map((type) => ({
  label: mentorPairingTypeLabels[type],
  value: type,
}));

// The trainee, the type and the start date are empty until they are filled in.
type PairingForm = Omit<MentorPairing, 'trainee' | 'type' | 'startDate'> & {
  trainee: TraineeReference | null;
  type: MentorPairingType | null;
  startDate: Date | null;
};

type FormErrors = Partial<Record<'trainee' | 'type' | 'startDate' | 'endDate' | 'lastCheckinDate', string>>;

// A function, so the start date is the day the dialog opens, not the day the page loaded.
const newPairing = (): PairingForm => ({
  id: '',
  trainee: null,
  type: null,
  startDate: today(),
  lastCheckinDate: null,
  endDate: null,
  nextCheckinDate: null,
  daysSinceLastCheckin: null,
});

// The errors of the fields that fail, or null when the form can be sent. The server checks the same dates.
const getFormErrors = (form: PairingForm): FormErrors | null => {
  const errors: FormErrors = {};
  if (!form.trainee) {
    errors.trainee = FIELD_REQUIRED_ERROR;
  }
  if (!form.type) {
    errors.type = FIELD_REQUIRED_ERROR;
  }
  if (!form.startDate) {
    errors.startDate = FIELD_REQUIRED_ERROR;
  } else if (form.endDate && form.endDate.getTime() < form.startDate.getTime()) {
    errors.endDate = 'Cannot be before the start date';
  }
  if (form.lastCheckinDate && daysFromToday(form.lastCheckinDate) > 0) {
    errors.lastCheckinDate = 'Cannot be in the future';
  }
  return Object.keys(errors).length > 0 ? errors : null;
};

interface DateFieldProps {
  label: string;
  value: Date | null;
  error?: string;
  clearable?: boolean;
  disabled: boolean;
  onChange: (date: Date | null) => void;
  // Shown under the field, like the next check-in shortcuts.
  children?: ReactNode;
}

// A date field with its error under it, half a row wide.
const DateField = ({ label, value, error, clearable, disabled, onChange, children }: DateFieldProps) => (
  <FormControl sx={{ flex: 1 }}>
    <FormDateField
      label={label}
      value={value}
      error={!!error}
      clearable={clearable}
      disabled={disabled}
      onChange={onChange}
    />
    {error && <FormHelperText error>{error}</FormHelperText>}
    {children}
  </FormControl>
);

interface MentorPairingDialogProps {
  isOpen: boolean;
  isLoading: boolean;
  error: string;
  title: string;
  // The pairing to edit, or null to add a new one.
  initialPairing: MentorPairing | null;
  onClose: () => void;
  onSave: (pairing: MentorPairing) => void;
}

/** The dialog to pair the volunteer with a trainee, or to edit initialPairing when it is set. */
export const MentorPairingDialog = ({
  isOpen,
  isLoading,
  error,
  title,
  initialPairing,
  onClose,
  onSave,
}: MentorPairingDialogProps) => {
  const [form, setForm] = useState<PairingForm>(() => initialPairing ?? newPairing());
  const [errors, setErrors] = useState<FormErrors | null>(null);
  // The date field keeps what it shows itself, so a shortcut mounts it again with a new key to show its date.
  const [nextCheckinFieldKey, setNextCheckinFieldKey] = useState(0);

  // Sets a field and clears its error, if it had one.
  const setField = <K extends keyof PairingForm>(name: K, value: PairingForm[K]) => {
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
    setErrors((prevErrors) => (prevErrors ? { ...prevErrors, [name]: undefined } : null));
  };

  // That many days after the last check-in, or after today before the first one.
  const shortcutDate = (days: number) => addDays(form.lastCheckinDate ?? today(), days);

  const applyShortcut = (days: number) => {
    setField('nextCheckinDate', shortcutDate(days));
    setNextCheckinFieldKey((key) => key + 1);
  };

  const handleSubmit = () => {
    const formErrors = getFormErrors(form);
    setErrors(formErrors);
    // Checked again only so TypeScript knows the trainee, the type and the start date are set.
    if (formErrors || !form.trainee || !form.type || !form.startDate) {
      return;
    }
    onSave({ ...form, trainee: form.trainee, type: form.type, startDate: form.startDate });
  };

  return (
    <FormDialog
      isOpen={isOpen}
      title={title}
      submitLabel={initialPairing ? 'Save' : 'Add'}
      isSaving={isLoading}
      error={error}
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      {/* Aligned to the top, so an error message under one field does not stretch the other. */}
      <Stack direction="row" spacing={2} sx={{ alignItems: 'flex-start' }}>
        <Stack sx={{ flex: 1, minWidth: 0 }}>
          <TraineeAutocomplete
            label="Trainee"
            value={form.trainee}
            error={errors?.trainee}
            disabled={isLoading}
            onChange={(trainee) => setField('trainee', trainee)}
          />
        </Stack>
        <DropdownSelect
          id="pairingType"
          name="type"
          label="Type"
          options={typeOptions}
          disabled={isLoading}
          value={form.type ?? undefined}
          error={errors?.type}
          width="22ch"
          onChange={(event) => setField('type', event.target.value as MentorPairingType)}
        />
      </Stack>
      <Stack direction="row" spacing={2} sx={{ alignItems: 'flex-start' }}>
        <DateField
          label="Start date"
          value={form.startDate}
          error={errors?.startDate}
          disabled={isLoading}
          onChange={(date) => setField('startDate', date)}
        />
        <DateField
          label="End date"
          value={form.endDate}
          error={errors?.endDate}
          clearable
          disabled={isLoading}
          onChange={(date) => setField('endDate', date)}
        />
      </Stack>
      <Stack direction="row" spacing={2} sx={{ alignItems: 'flex-start' }}>
        <DateField
          label="Last check-in"
          value={form.lastCheckinDate}
          error={errors?.lastCheckinDate}
          clearable
          disabled={isLoading}
          onChange={(date) => setField('lastCheckinDate', date)}
        />
        <DateField
          key={nextCheckinFieldKey}
          label="Next check-in"
          value={form.nextCheckinDate}
          clearable
          disabled={isLoading}
          onChange={(date) => setField('nextCheckinDate', date)}
        >
          <Stack direction="row" spacing={1} sx={{ paddingTop: 1 }}>
            {NEXT_CHECKIN_SHORTCUTS.map((days) => (
              // The date describes the chip, so a screen reader still says "+7d" as its name.
              <Tooltip key={days} title={formatDateForDisplay(shortcutDate(days))} placement="bottom" describeChild>
                <Chip label={`+${days}d`} size="small" variant="outlined" onClick={() => applyShortcut(days)} />
              </Tooltip>
            ))}
          </Stack>
        </DateField>
      </Stack>
    </FormDialog>
  );
};
