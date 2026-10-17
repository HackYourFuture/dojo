import { Box, Tooltip, Typography } from '@mui/material';
import { green, orange, red, yellow } from '@mui/material/colors';

import { City } from '../models/city';
import CommuteIcon from '@mui/icons-material/Commute';

// Light shades, as the tooltip is dark grey in both themes.
const getCommute = (distance: number) => {
  if (distance <= 40) {
    return { label: 'Near', color: green[400] };
  }
  if (distance <= 80) {
    return { label: 'Medium', color: yellow[500] };
  }
  if (distance <= 160) {
    return { label: 'Far', color: orange[500] };
  }
  return { label: 'Very far', color: red[400] };
};

interface CityLabelProps {
  city: City;
}

/** The city's name, with its province and distance from Amsterdam on hover. */
export const CityLabel = ({ city }: CityLabelProps) => {
  const distance = city.distanceAmsterdam;
  const commute = distance !== null ? getCommute(distance) : null;

  const details = (
    <Typography variant="body2">
      <div>{city.province}</div>
      {commute && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <CommuteIcon titleAccess={commute.label} sx={{ fontSize: '1.1em', color: commute.color }} />
          {distance}km
        </Box>
      )}
    </Typography>
  );

  return (
    <Tooltip title={details}>
      <span>{city.name}</span>
    </Tooltip>
  );
};
