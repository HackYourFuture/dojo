import { Box, FormControl, FormHelperText, TextField } from '@mui/material';
import { daysFromToday, today } from '../../../../data/dates';

import { FIELD_REQUIRED_ERROR } from '../../../../data/text';
import { FormDateField } from '../../../../components/FormDateField';
import { FormDialog } from '../../../../components/FormDialog';
import { MentorshipCheckin } from '../MentorshipCheckin';
import { NextCheckinDateField } from '../../components/NextCheckinDateField';
import { useState } from 'react';

// The date is null while it is cleared or half typed. The next check-in date is the mentorship's, which adding can change.
type CheckinForm = Omit<MentorshipCheckin, 'date'> & { date: Date | null; nextCheckinDate: Date | null };

type FormErrors = Partial<Record<'date' | 'notes', string>>;

// A function, so the date is the day the dialog opens, not the day the page loaded.
const newCheckin = (): MentorshipCheckin => ({
  id: '',
  date: today(),
  notes: '',
});

// The errors of the fields that fail, or null when the form can be sent.
const getFormErrors = (form: CheckinForm): FormErrors | null => {
  const errors: FormErrors = {};
  if (!form.date) {
    errors.date = FIELD_REQUIRED_ERROR;
  } else if (daysFromToday(form.date) > 0) {
    // The API only takes today or earlier. Checked here too, so the message sits under the field.
    errors.date = 'The date cannot be in the future';
  }
  if (form.notes.trim() === '') {
    errors.notes = FIELD_REQUIRED_ERROR;
  }
  return Object.keys(errors).length > 0 ? errors : null;
};

interface MentorshipCheckinDialogProps {
  isOpen: boolean;
  isLoading: boolean;
  error: string;
  // The check-in to edit, or null to add a new one.
  initialCheckin: MentorshipCheckin | null;
  // The next check-in date to start from, which the dialog offers to change while adding.
  nextCheckinDate: Date | null;
  onClose: () => void;
  onSave: (checkin: MentorshipCheckin, nextCheckinDate: Date | null) => void;
}

/** The dialog to add a check-in and plan the next one, or to edit initialCheckin when it is set. */
export const MentorshipCheckinDialog = ({
  isOpen,
  isLoading,
  error,
  initialCheckin,
  nextCheckinDate,
  onClose,
  onSave,
}: MentorshipCheckinDialogProps) => {
  const [form, setForm] = useState<CheckinForm>(() => ({ ...(initialCheckin ?? newCheckin()), nextCheckinDate }));
  const [errors, setErrors] = useState<FormErrors | null>(null);

  const isEditMode = Boolean(initialCheckin);

  // Sets a field and clears its error, if it had one.
  const setField = <K extends keyof CheckinForm>(name: K, value: CheckinForm[K]) => {
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
    setErrors((prevErrors) => (prevErrors ? { ...prevErrors, [name]: undefined } : null));
  };

  const handleSubmit = () => {
    const formErrors = getFormErrors(form);
    setErrors(formErrors);
    // Checked again only so TypeScript knows the date is set.
    if (formErrors || !form.date) {
      return;
    }
    onSave({ id: form.id, date: form.date, notes: form.notes }, form.nextCheckinDate);
  };

  return (
    <FormDialog
      isOpen={isOpen}
      title={isEditMode ? 'Edit check-in' : 'New check-in'}
      submitLabel={isEditMode ? 'Save' : 'Add'}
      isSaving={isLoading}
      error={error}
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      {/* Two columns, so the date keeps half the width when editing, without the next check-in date beside it. */}
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, alignItems: 'start' }}>
        <FormControl>
          <FormDateField
            disabled={isLoading}
            label="Date"
            value={form.date}
            error={!!errors?.date}
            onChange={(date) => setField('date', date)}
          />
          {errors?.date && <FormHelperText error>{errors.date}</FormHelperText>}
        </FormControl>
        {!isEditMode && (
          <FormControl>
            {/* The shortcuts count from this check-in, or from today while its date is empty. */}
            <NextCheckinDateField
              value={form.nextCheckinDate}
              from={form.date ?? today()}
              disabled={isLoading}
              onChange={(date) => setField('nextCheckinDate', date)}
            />
          </FormControl>
        )}
      </Box>
      {/* Taller than the notes of an assignment, as the notes are what a check-in is about. */}
      <TextField
        disabled={isLoading}
        name="notes"
        label="Notes"
        multiline
        minRows={4}
        maxRows={12}
        value={form.notes}
        onChange={(event) => setField('notes', event.target.value)}
        error={!!errors?.notes}
        helperText={errors?.notes}
        slotProps={{ htmlInput: { maxLength: 5000 } }}
      />
    </FormDialog>
  );
};
