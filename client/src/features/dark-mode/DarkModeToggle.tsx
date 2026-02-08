import { Box, Switch, styled } from '@mui/material';

import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { useColorScheme } from '@mui/material/styles';

const SWITCH_COLORS = {
  sun: '#FFA500',
  moon: '#2C1810',
  trackActive: '#B8814E',
  trackInactive: '#f5f5f5',
  iconLight: '#FFF',
  iconDark: '#fff',
} as const;

const StyledSwitch = styled(Switch)(() => ({
  width: 62,
  height: 34,
  padding: 7,
  '& .MuiSwitch-switchBase': {
    margin: 1,
    padding: 0,
    transform: 'translateX(0px)',
    '&.Mui-checked': {
      color: '#fff',
      transform: 'translateX(22px)',
      '& .MuiSwitch-thumb': {
        backgroundColor: SWITCH_COLORS.moon,
      },
      '& + .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: SWITCH_COLORS.trackActive,
      },
    },
  },
  '& .MuiSwitch-thumb': {
    backgroundColor: SWITCH_COLORS.sun,
    width: 32,
    height: 32,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  '& .MuiSwitch-track': {
    opacity: 1,
    backgroundColor: SWITCH_COLORS.trackInactive,
    borderRadius: 20 / 2,
  },
}));

export const DarkModeToggle = () => {
  const { mode, setMode, systemMode } = useColorScheme();

  const isDark = mode === 'system' ? systemMode === 'dark' : mode === 'dark';

  const handleToggle = () => {
    setMode(isDark ? 'light' : 'dark');
  };

  return (
    <StyledSwitch
      checked={isDark}
      onChange={handleToggle}
      slotProps={{
        input: {
          'aria-label': 'Toggle dark mode',
        },
      }}
      icon={
        <Box
          sx={{
            width: 32,
            height: 32,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: SWITCH_COLORS.sun,
            borderRadius: '50%',
          }}
        >
          <LightModeIcon sx={{ fontSize: 20, color: SWITCH_COLORS.iconLight }} />
        </Box>
      }
      checkedIcon={
        <Box
          sx={{
            width: 32,
            height: 32,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: SWITCH_COLORS.moon,
            borderRadius: '50%',
          }}
        >
          <DarkModeIcon sx={{ fontSize: 20, color: SWITCH_COLORS.iconDark }} />
        </Box>
      }
    />
  );
};
