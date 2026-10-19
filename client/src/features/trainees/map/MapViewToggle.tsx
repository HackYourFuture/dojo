import { ToggleButton, ToggleButtonGroup } from '@mui/material';

import MapIcon from '@mui/icons-material/Map';
import ViewListIcon from '@mui/icons-material/ViewList';
import { setParam } from '../../../data/listFilters';
import { useSearchParams } from 'react-router';

interface MapViewToggleProps {
  isMap: boolean;
}

/** Switches the trainees page between the list and the map, kept in the URL so Back from a profile returns to it. */
export const MapViewToggle = ({ isMap }: MapViewToggleProps) => {
  const [, setSearchParams] = useSearchParams();

  // Like the filters, replaces the history entry and keeps the scroll position.
  const setView = (view: 'list' | 'map' | null) => {
    // Clicking the selected button gives null.
    if (view !== null) {
      setSearchParams((params) => setParam(params, 'view', view === 'map' ? ['map'] : []), {
        replace: true,
        preventScrollReset: true,
      });
    }
  };

  return (
    <ToggleButtonGroup
      exclusive
      size="small"
      value={isMap ? 'map' : 'list'}
      onChange={(_event, view: 'list' | 'map' | null) => setView(view)}
      aria-label="View"
    >
      <ToggleButton value="list" aria-label="List">
        <ViewListIcon />
      </ToggleButton>
      <ToggleButton value="map" aria-label="Map">
        <MapIcon />
      </ToggleButton>
    </ToggleButtonGroup>
  );
};
