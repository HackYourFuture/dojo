import { ChangeEvent, useRef, useState } from 'react';
import { FormControl, FormHelperText, Stack, TextField } from '@mui/material';
import { VolunteerAssignmentType, volunteerAssignmentTypeLabels } from '../../VolunteerAssignmentType';

import { DropdownSelect } from '../../../../components/DropdownSelect';
import { FIELD_REQUIRED_ERROR } from '../../../../data/text';
import { FormDateField } from '../../../../components/FormDateField';
import { FormDialog } from '../../../../components/FormDialog';
import { VolunteerAssignment } from '../VolunteerAssignment';
import { today } from '../../../../data/dates';

// The most hours the API accepts for one assignment.
const MAX_HOURS = 1000;

const typeOptions = Object.values(VolunteerAssignmentType).map((type) => ({
  label: volunteerAssignmentTypeLabels[type],
  value: type,
}));

// The type and the start date are empty until they are filled in.
type AssignmentForm = Omit<VolunteerAssignment, 'type' | 'startDate'> & {
  type: VolunteerAssignmentType | null;
  startDate: Date | null;
};

type FormErrors = Partial<Record<'type' | 'estimatedHours' | 'startDate', string>>;

// A function, so the start date is the day the dialog opens, not the day the page loaded.
const newAssignment = (): AssignmentForm => ({
  id: '',
  type: null,
  estimatedHours: null,
  startDate: today(),
  endDate: null,
  notes: '',
});

// The errors of the fields that fail, or null when the form can be sent.
const getFormErrors = (form: AssignmentForm, isHoursUnreadable: boolean): FormErrors | null => {
  const errors: FormErrors = {};
  if (!form.type) {
    errors.type = FIELD_REQUIRED_ERROR;
  }
  const hours = form.estimatedHours;
  if (isHoursUnreadable || (hours !== null && (!Number.isInteger(hours) || hours < 1 || hours > MAX_HOURS))) {
    errors.estimatedHours = `Whole hours from 1 to ${MAX_HOURS}`;
  }
  if (!form.startDate) {
    errors.startDate = FIELD_REQUIRED_ERROR;
  }
  return Object.keys(errors).length > 0 ? errors : null;
};

interface VolunteerAssignmentDialogProps {
  isOpen: boolean;
  isLoading: boolean;
  error: string;
  // The assignment to edit, or null to add a new one.
  initialAssignment: VolunteerAssignment | null;
  onClose: () => void;
  onSave: (assignment: VolunteerAssignment) => void;
}

/** The dialog to add an assignment, or to edit initialAssignment when it is set. */
export const VolunteerAssignmentDialog = ({
  isOpen,
  isLoading,
  error,
  initialAssignment,
  onClose,
  onSave,
}: VolunteerAssignmentDialogProps) => {
  const [form, setForm] = useState<AssignmentForm>(() => initialAssignment ?? newAssignment());
  const [errors, setErrors] = useState<FormErrors | null>(null);
  // The number input gives '' for text it cannot read, like "10-20", so on submit the input itself is asked.
  const hoursInputRef = useRef<HTMLInputElement>(null);

  const isEditMode = Boolean(initialAssignment);

  // Sets a field and clears its error, if it had one.
  const setField = <K extends keyof AssignmentForm>(name: K, value: AssignmentForm[K]) => {
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
    setErrors((prevErrors) => (prevErrors ? { ...prevErrors, [name]: undefined } : null));
  };

  // The number input gives '' when it is emptied, which means no estimate.
  const handleHoursChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setField('estimatedHours', value === '' ? null : Number(value));
  };

  const handleSubmit = () => {
    // The server checks the end date against the start date, and its message is shown below the form.
    const formErrors = getFormErrors(form, hoursInputRef.current?.validity.badInput ?? false);
    setErrors(formErrors);
    // Checked again only so TypeScript knows the type and start date are set.
    if (formErrors || !form.type || !form.startDate) {
      return;
    }
    onSave({ ...form, type: form.type, startDate: form.startDate });
  };

  return (
    <FormDialog
      isOpen={isOpen}
      title={isEditMode ? 'Edit assignment' : 'New assignment'}
      submitLabel={isEditMode ? 'Save' : 'Add'}
      isSaving={isLoading}
      error={error}
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      {/* No ids but the dropdown's, so MUI generates them: the profile's inputs use their names as ids while it is edited. */}
      {/* Aligned to the top, so an error message under one field does not stretch the other. */}
      <Stack direction="row" spacing={2} sx={{ alignItems: 'flex-start' }}>
        <DropdownSelect
          id="assignmentType"
          name="type"
          label="Type"
          options={typeOptions}
          disabled={isLoading}
          value={form.type ?? undefined}
          error={errors?.type}
          onChange={(event) => setField('type', event.target.value as VolunteerAssignmentType)}
        />
        <TextField
          disabled={isLoading}
          name="estimatedHours"
          label="Estimated hours"
          type="number"
          inputRef={hoursInputRef}
          value={form.estimatedHours ?? ''}
          onChange={handleHoursChange}
          error={!!errors?.estimatedHours}
          helperText={errors?.estimatedHours}
          // The label stays above, like the dates': text the input cannot read counts as empty and would sit under it.
          slotProps={{ htmlInput: { min: 1, max: MAX_HOURS, step: 1 }, inputLabel: { shrink: true } }}
          sx={{ flex: 1 }}
        />
      </Stack>
      <Stack direction="row" spacing={2} sx={{ alignItems: 'flex-start' }}>
        <FormControl sx={{ flex: 1 }}>
          <FormDateField
            disabled={isLoading}
            label="Start date"
            value={form.startDate}
            error={!!errors?.startDate}
            onChange={(date) => setField('startDate', date)}
          />
          {errors?.startDate && <FormHelperText error>{errors.startDate}</FormHelperText>}
        </FormControl>
        <FormControl sx={{ flex: 1 }}>
          <FormDateField
            disabled={isLoading}
            label="End date"
            value={form.endDate}
            clearable
            onChange={(date) => setField('endDate', date)}
          />
        </FormControl>
      </Stack>
      <TextField
        disabled={isLoading}
        name="notes"
        label="Notes"
        multiline
        minRows={2}
        maxRows={6}
        value={form.notes ?? ''}
        onChange={(event) => setField('notes', event.target.value)}
        slotProps={{ htmlInput: { maxLength: 5000 } }}
      />
    </FormDialog>
  );
};
