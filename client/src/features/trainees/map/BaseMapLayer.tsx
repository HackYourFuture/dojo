import 'maplibre-gl/dist/maplibre-gl.css';

import { MAP_ATTRIBUTION, MAP_STYLE_URL, customiseMapStyle } from './mapStyle';
import { useEffect, useState } from 'react';

import maplibreGL from '@maplibre/maplibre-gl-leaflet';
import { setWorkerUrl } from 'maplibre-gl';
import { useMap } from 'react-leaflet';
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url';

// MapLibre looks for its worker next to its own file, which bundling breaks. Vite builds it as a worker on our origin,
// which the CSP's script-src allows.
setWorkerUrl(workerUrl);

interface BaseMapLayerProps {
  isDark: boolean;
}

/** The map under the markers: OpenFreeMap's vector tiles, drawn by MapLibre in our own style. */
export const BaseMapLayer = ({ isDark }: BaseMapLayerProps) => {
  const map = useMap();
  // Starts empty, as the style is only customised once it is fetched.
  const [layer] = useState(() =>
    maplibreGL({
      style: { version: 8, sources: {}, layers: [] },
      attributionControl: { customAttribution: MAP_ATTRIBUTION },
    })
  );

  useEffect(() => {
    layer.addTo(map);
    return () => {
      layer.remove();
    };
  }, [map, layer]);

  // A theme switch only changes colours, which MapLibre applies without loading the tiles again.
  useEffect(() => {
    layer.getMaplibreMap().setStyle(MAP_STYLE_URL, {
      transformStyle: (_previous, next) => customiseMapStyle(next, isDark),
    });
  }, [layer, isDark]);

  return null;
};
