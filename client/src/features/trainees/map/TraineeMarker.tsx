import { Link, Typography } from '@mui/material';
import { Marker, Popup, Tooltip } from 'react-leaflet';

import { City } from '../../geo/models/city';
import { CityLabel } from '../../geo/components/CityLabel';
import { Link as RouterLink } from 'react-router';
import { TraineeSummary } from '../models/trainee-summary';
import { getCohortLabel } from '../../../data/labels/traineeLabels';
import { icon } from 'leaflet';
import { memo } from 'react';
import personIcon from './person.svg';

interface TraineeMarkerProps {
  trainee: TraineeSummary;
  city: City;
}

/** A trainee's picture at their city on the map, with their name and cohort on hover, and more on click. */
const TraineeMarker = ({ trainee, city }: TraineeMarkerProps) => (
  <Marker
    position={[city.coordinates.lat, city.coordinates.lon]}
    icon={icon({
      iconUrl: trainee.thumbnailUrl ?? personIcon,
      iconSize: [32, 32],
      popupAnchor: [0, -16],
      tooltipAnchor: [0, 16],
      className: 'trainee-marker',
    })}
    alt={trainee.displayName}
  >
    {/* Below the picture, where it doesn't cover the popup. */}
    <Tooltip direction="bottom">
      {trainee.displayName}
      <br />
      {getCohortLabel(trainee.cohort)}
    </Tooltip>
    <Popup>
      <Typography variant="subtitle2">{trainee.displayName}</Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        {getCohortLabel(trainee.cohort)}
      </Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        <CityLabel city={city} />
      </Typography>
      <Link component={RouterLink} to={trainee.profilePath} variant="body2">
        Open profile
      </Link>
    </Popup>
  </Marker>
);

// A new position or icon re-adds the marker to its group, which closes a fanned-out group, so it only renders when
// the trainee changes. React Query keeps an unchanged trainee the same object.
export default memo(TraineeMarker);
