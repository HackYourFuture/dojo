// The types of react-leaflet-cluster's options, which it reads from Leaflet's namespace.
/// <reference types="leaflet.markercluster" />
import 'leaflet/dist/leaflet.css';
import 'react-leaflet-cluster/dist/assets/MarkerCluster.css';
import 'react-leaflet-cluster/dist/assets/MarkerCluster.Default.css';

import { Box, LinearProgress, Typography, useTheme } from '@mui/material';

import { BaseMapLayer } from './BaseMapLayer';
import { ErrorBox } from '../../../components/ErrorBox';
import { LatLngBoundsExpression } from 'leaflet';
import { MapContainer } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import { TraineeFilters } from '../models/trainee-summary';
import TraineeMarker from './TraineeMarker';
import { useGetAllTrainees } from './useGetAllTrainees';

// The map opens on the whole of the Netherlands.
const NETHERLANDS: LatLngBoundsExpression = [
  [50.75, 3.36],
  [53.56, 7.23],
];

// MapLibre draws the map with WebGL 2. Without it, the trainees still show, on a blank background.
const CAN_DRAW_MAP = !!document.createElement('canvas').getContext('webgl2');

interface TraineeMapProps {
  filters: TraineeFilters;
}

/** Every trainee that matches the filters on a map, at their city, grouped where they are close together. */
const TraineeMap = ({ filters }: TraineeMapProps) => {
  const isDark = useTheme().palette.mode === 'dark';
  const { data, error, isError, isPending, isPlaceholderData } = useGetAllTrainees(filters);
  const total = data?.totalElements ?? 0;
  const withoutCity = data?.items.filter((trainee) => trainee.city === null).length ?? 0;

  return (
    <>
      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        {data ? `${total} ${total === 1 ? 'trainee' : 'trainees'}` : '\u00a0'}
        {withoutCity > 0 && ` · ${withoutCity} not on the map (no city)`}
      </Typography>
      <LinearProgress
        sx={{ height: 2, mt: 0.5, mb: 1.5, visibility: isPending || isPlaceholderData ? 'visible' : 'hidden' }}
      />
      {isError && <ErrorBox errorMessage={error.message} sx={{ mt: 0, mb: 1.5 }} />}
      {!CAN_DRAW_MAP && (
        <ErrorBox errorMessage="This browser can't draw the map, as it has no WebGL 2." sx={{ mt: 0, mb: 1.5 }} />
      )}
      <Box
        sx={(theme) => ({
          // Round pictures, the border inside their size.
          '& .trainee-marker': {
            borderRadius: '50%',
            border: 2,
            borderColor: 'background.paper',
            boxSizing: 'border-box',
            objectFit: 'cover',
          },
          // Leaflet's popup is white, with its own margins and link colour, which would hide the text in dark mode.
          '& .leaflet-popup-content-wrapper, & .leaflet-popup-tip': {
            bgcolor: 'background.paper',
            color: 'text.primary',
          },
          '& .leaflet-popup-content p': { m: 0 },
          '& .leaflet-popup-content a': { color: 'primary.main' },
          // Like MUI's tooltip, without Leaflet's arrow.
          '& .leaflet-tooltip': {
            bgcolor: theme.alpha(theme.palette.grey[700], 0.92),
            color: 'common.white',
            border: 0,
            borderRadius: 1,
            boxShadow: 'none',
            px: 1,
            py: 0.5,
            fontFamily: theme.typography.fontFamily,
            fontSize: theme.typography.pxToRem(11),
            fontWeight: theme.typography.fontWeightMedium,
          },
          '& .leaflet-tooltip::before': { display: 'none' },
        })}
      >
        {/* The cluster group needs the map's highest zoom. */}
        <MapContainer bounds={NETHERLANDS} maxZoom={18} style={{ height: '70vh', minHeight: 400 }}>
          {CAN_DRAW_MAP && <BaseMapLayer isDark={isDark} />}
          {/* Groups pictures within 40px of each other, half the default. A group in one city fans out wider than the
              default, so its pictures don't overlap. */}
          <MarkerClusterGroup maxClusterRadius={40} spiderfyDistanceMultiplier={1.5} showCoverageOnHover={false}>
            {data?.items.map(
              (trainee) => trainee.city && <TraineeMarker key={trainee.id} trainee={trainee} city={trainee.city} />
            )}
          </MarkerClusterGroup>
        </MapContainer>
      </Box>
    </>
  );
};

// The default export lets the trainees page load the map, Leaflet and MapLibre only when it is opened.
export default TraineeMap;
