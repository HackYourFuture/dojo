import { DropdownSelect } from '../profile/components/DropdownSelect';
import React from 'react';
import { SelectChangeEvent } from '@mui/material';
import { Track } from '@/data/types/Trainee';

const getTrackLabel = (track: Track): string => {
  switch (track) {
    case Track.Backend:
      return 'Backend';
    case Track.Frontend:
      return 'Frontend';
    case Track.Data:
      return 'Data Science';
    case Track.Tester:
      return 'Tester';
    case Track.Cloud:
      return 'Cloud';
    case Track.Core:
      return 'Core';
    case Track.FullstackLegacy:
      return 'Fullstack Legacy';
    default:
      return track;
  }
};

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
};

export const TrackSelect: React.FC<TrackSelectProps> = ({
  isEditing,
  value,
  onChange,
  name = 'track',
  id = 'track',
  label = 'track',
  inputLabel = 'Track',
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
      width={'20ch'}
    />
  );
};

export default TrackSelect;
