import { Box, Tabs } from '@mui/material';

import { ReactNode } from 'react';

interface ProfileTabBarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  // The Tab elements.
  children: ReactNode;
}

/** The tabs of a profile, above a line across the page. */
export const ProfileTabBar = ({ activeTab, onTabChange, children }: ProfileTabBarProps) => {
  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
      <Tabs
        value={activeTab}
        onChange={(_, value) => onTabChange(value)}
        aria-label="Profile sections"
        variant="scrollable"
        scrollButtons="auto"
      >
        {children}
      </Tabs>
    </Box>
  );
};
