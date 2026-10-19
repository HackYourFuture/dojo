import type {
  ExpressionSpecification,
  LayerSpecification,
  LineLayerSpecification,
  StyleSpecification,
  SymbolLayerSpecification,
} from 'maplibre-gl';

// OpenFreeMap's light map, made from OpenStreetMap and free without a key or an account: https://openfreemap.org
export const MAP_STYLE_URL = 'https://tiles.openfreemap.org/styles/positron';

export const MAP_ATTRIBUTION =
  '<a href="https://openfreemap.org">OpenFreeMap</a> <a href="https://www.openmaptiles.org/">&copy; OpenMapTiles</a> ' +
  'Data from <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';

// The Dutch name, like Den Haag and Duitsland, or else the local one.
const DUTCH_NAME: ExpressionSpecification = ['coalesce', ['get', 'name:nl'], ['get', 'name']];

interface MapColors {
  // Every area but water, so parks, woods and buildings don't add noise.
  land: string;
  water: string;
  // The motorways, and the airports' runways.
  road: string;
  border: string;
  province: string;
  label: string;
  waterLabel: string;
  city: string;
  halo: string;
}

const LIGHT: MapColors = {
  land: '#f2f3f0',
  water: '#b3d1e6',
  road: '#d6d6d6',
  border: '#404040',
  province: '#8c8c8c',
  label: '#333333',
  waterLabel: '#495e91',
  city: '#1a1a1a',
  halo: '#ffffff',
};

const DARK: MapColors = {
  land: '#2d2d2d',
  water: '#1d3346',
  road: '#4a4a4a',
  border: '#d0d0d0',
  province: '#8a8a8a',
  label: '#d8d8d8',
  waterLabel: '#8fb3d9',
  city: '#f0f0f0',
  halo: '#1a1a1a',
};

// Motorways are the only roads left; road names and shields go too.
const isHiddenRoad = (layer: LayerSpecification) => {
  if (!('source-layer' in layer)) {
    return false;
  }
  const isRoad = layer['source-layer'] === 'transportation' || layer['source-layer'] === 'transportation_name';
  return isRoad && !layer.id.startsWith('highway_motorway');
};

const customiseLine = (layer: LineLayerSpecification, colors: MapColors): LayerSpecification => {
  // The national borders, dark and thick.
  if (layer.id === 'boundary_2') {
    return {
      ...layer,
      paint: {
        ...layer.paint,
        'line-color': colors.border,
        'line-width': ['interpolate', ['linear'], ['zoom'], 4, 1.5, 7, 2.5, 12, 4],
      },
    };
  }
  // The provinces, dashed, already on the map of the whole country.
  if (layer.id === 'boundary_3') {
    return {
      ...layer,
      minzoom: 5,
      filter: ['all', ['==', ['get', 'admin_level'], 4], ['!=', ['get', 'maritime'], 1]],
      paint: {
        ...layer.paint,
        'line-color': colors.province,
        'line-width': ['interpolate', ['linear'], ['zoom'], 5, 0.8, 10, 1.5],
        'line-dasharray': [3, 2],
      },
    };
  }
  if (layer.id === 'waterway') {
    return { ...layer, paint: { ...layer.paint, 'line-color': colors.water } };
  }
  return { ...layer, paint: { ...layer.paint, 'line-color': colors.road, 'line-opacity': 0.6 } };
};

const customiseLabel = (layer: SymbolLayerSpecification, colors: MapColors): LayerSpecification => {
  const label = {
    ...layer,
    layout: { ...layer.layout, 'text-field': DUTCH_NAME, 'text-max-width': 12 },
    paint: {
      ...layer.paint,
      'text-color': layer.id.startsWith('water') ? colors.waterLabel : colors.label,
      'text-halo-color': colors.halo,
    },
  };
  // The main cities bold and big.
  if (layer.id === 'label_city' || layer.id === 'label_city_capital') {
    return {
      ...label,
      layout: {
        ...label.layout,
        'text-font': ['Noto Sans Bold'],
        'text-size': ['interpolate', ['linear'], ['zoom'], 5, 12, 7, 15, 10, 20],
      },
      paint: { ...label.paint, 'text-color': colors.city, 'text-halo-width': 1.5 },
    };
  }
  // Towns and villages only closer in, so the cities stand out on the map of the country.
  if (layer.id === 'label_town') {
    return { ...label, minzoom: 8 };
  }
  if (layer.id === 'label_village') {
    return { ...label, minzoom: 11 };
  }
  if (layer.id === 'label_other') {
    return { ...label, minzoom: 12 };
  }
  return label;
};

const customiseLayer = (layer: LayerSpecification, colors: MapColors): LayerSpecification => {
  switch (layer.type) {
    case 'background':
      return { ...layer, paint: { ...layer.paint, 'background-color': colors.land } };
    case 'fill':
      return { ...layer, paint: { ...layer.paint, 'fill-color': layer.id === 'water' ? colors.water : colors.land } };
    case 'line':
      return customiseLine(layer, colors);
    case 'symbol':
      return customiseLabel(layer, colors);
    default:
      return layer;
  }
};

/** OpenFreeMap's Positron with strong national borders, the provinces, only motorways, bold cities and Dutch names. */
export const customiseMapStyle = (style: StyleSpecification, isDark: boolean): StyleSpecification => {
  const colors = isDark ? DARK : LIGHT;
  return {
    ...style,
    layers: style.layers.filter((layer) => !isHiddenRoad(layer)).map((layer) => customiseLayer(layer, colors)),
  };
};
