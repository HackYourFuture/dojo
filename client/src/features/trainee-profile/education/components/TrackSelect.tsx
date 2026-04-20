import { DropdownSelect } from '../../profile/components/DropdownSelect';
import React from 'react';
import { SelectChangeEvent, SxProps, Theme } from '@mui/material';
import { Track } from '@/data/types/Trainee';
import { getTrackLabel } from '@/data/labels/traineeLabels';

const trackOptions = Object.values(Track).map((track) => ({
  label: getTrackLabel(track),
  value: track,
}));

type TrackSelectProps = {
  isEditing: boolean;
  value?: string;
  onChange: (event: SelectChangeEvent<string>) => void;
  name?: string;
  id?: string;
  label?: string;
  inputLabel?: string;
  width?: string | number;
  sx?: SxProps<Theme>;
};

export const TrackSelect: React.FC<TrackSelectProps> = ({
  isEditing,
  value,
  onChange,
  name = 'track',
  id = 'track',
  label = 'track',
  inputLabel = 'Track',
  width,
  sx,
}) => {
  return (
    <DropdownSelect
      isEditing={isEditing}
      value={value}
      onChange={onChange}
      options={trackOptions}
      name={name}
      id={id}
      label={label}
      inputLabel={inputLabel}
      width={width}
      sx={sx}
    />
  );
};

export default TrackSelect;
