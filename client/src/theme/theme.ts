import '@mui/lab/themeAugmentation';

import { createTheme } from '@mui/material';

declare module '@mui/material/styles' {
  interface TypeBackground {
    paperAlt?: string;
    dark?: string;
  }

  interface Palette {
    hyfBeige: Palette['primary'];
  }

  interface PaletteOptions {
    hyfBeige: Palette['primary'];
  }
}

export const theme = createTheme({
  colorSchemes: {
    dark: {
      palette: {
        background: {
          default: '#1a1a1a', // Brighter than default #121212
          paper: '#2d2d2d', // Brighter elevated surfaces
          paperAlt: '#252525',
        },
        primary: {
          main: '#E63900',
        },
        hyfBeige: {
          main: '#3a3a3a', // Medium gray - darker than paper
          light: '#4a4a4a', // Lighter gray
          dark: '#2a2a2a', // Darker gray - close to default bg
          contrastText: '#fff', // White text
        },
        text: {
          primary: '#ffffff',
        },
      },
    },
    light: {
      palette: {
        primary: {
          main: '#B12900',
        },

        hyfBeige: createTheme().palette.augmentColor({
          color: { main: '#faf5d9' },
          name: 'hyfBeige',
        }),
        background: {
          default: '#fbfbfb',
          paper: '#FFF',
          paperAlt: '#f5f5f5',
          dark: '#f7f7f7',
        },
        text: {
          primary: '#213547',
        },
      },
    },
  },
  typography: {
    fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',

    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
      fontWeight: 400,
    },

    button: {
      textTransform: 'none',
    },
  },
});
