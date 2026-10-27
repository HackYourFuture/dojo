import { FormDateField } from '../../../components/FormDateField';
import { NextCheckinShortcuts } from './NextCheckinShortcuts';
import { useState } from 'react';

interface NextCheckinDateFieldProps {
  value: Date | null;
  // The date the shortcuts count from.
  from: Date;
  disabled?: boolean;
  onChange: (date: Date | null) => void;
}

/** The next check-in date of the add dialogs: a clearable date field with the +7d, +14d and +30d chips under it. */
export const NextCheckinDateField = ({ value, from, disabled, onChange }: NextCheckinDateFieldProps) => {
  // The date field keeps what it shows itself, so a shortcut mounts it again with a new key to show its date.
  const [fieldKey, setFieldKey] = useState(0);

  const applyShortcut = (date: Date) => {
    onChange(date);
    setFieldKey((key) => key + 1);
  };

  return (
    <>
      <FormDateField
        key={fieldKey}
        disabled={disabled}
        label="Next check-in date"
        value={value}
        clearable
        onChange={onChange}
      />
      <NextCheckinShortcuts from={from} disabled={disabled} onPick={applyShortcut} />
    </>
  );
};
