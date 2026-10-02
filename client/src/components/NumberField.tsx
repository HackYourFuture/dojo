import { FormControl, InputLabel, OutlinedInput, SxProps, Theme } from '@mui/material';

import { NumberField as BaseNumberField } from '@base-ui/react/number-field';

// Rounds a typed decimal to a whole number.
const WHOLE_NUMBER_FORMAT: Intl.NumberFormatOptions = { maximumFractionDigits: 0 };

interface NumberFieldProps {
  id: string;
  label: string;
  value: number | null;
  max?: number;
  placeholder?: string;
  onValueChange: (value: number | null) => void;
  sx?: SxProps<Theme>;
}

/**
 * A whole number of 0 or more: MUI's number field on Base UI, without the arrow buttons.
 */
export const NumberField = ({ id, label, value, max, placeholder, onValueChange, sx }: NumberFieldProps) => {
  // Composed as in https://mui.com/material-ui/react-number-field/
  return (
    <BaseNumberField.Root
      id={id}
      value={value}
      min={0}
      max={max}
      format={WHOLE_NUMBER_FORMAT}
      onValueChange={onValueChange}
      render={(props) => (
        <FormControl ref={props.ref} size="small" sx={sx}>
          {props.children}
        </FormControl>
      )}
    >
      <InputLabel htmlFor={id} shrink>
        {label}
      </InputLabel>
      <BaseNumberField.Input
        render={(props, state) => (
          <OutlinedInput
            slotProps={{ input: props }}
            // Leaves a gap in the border for the label, as TextField does.
            label={label}
            notched
            placeholder={placeholder}
            // OutlinedInput handles the ref, value, focus and change of its input itself, so these go to it as props too.
            inputRef={props.ref}
            value={state.inputValue}
            onBlur={props.onBlur}
            onChange={props.onChange}
            onFocus={props.onFocus}
          />
        )}
      />
    </BaseNumberField.Root>
  );
};
