import { Box, Tab, Tabs } from '@mui/material';

interface ProfileNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

/**
 * Component for navigating between trainee profile page tabs.
 *
 * @param {string} activeTab trainee id.
 * @param {string} onTabChange callback for when tab is changed.
 * @returns {ReactNode} A React element that renders trainee profile page tabs and active tab logic.
 */
const ProfileNav = ({ activeTab, onTabChange }: ProfileNavProps) => {
  return (
    // Sits on the bottom border of the tab bar, so the active tab line covers it.
    <Box display="flex" alignSelf="flex-end" minWidth={0}>
      <Tabs
        value={activeTab}
        onChange={(_, value) => onTabChange(value)}
        aria-label="Profile sections"
        variant="scrollable"
        scrollButtons="auto"
      >
        <Tab label="Personal" value="personal" />
        <Tab label="Contact" value="contact" />
        <Tab label="Education" value="education" />
        <Tab label="Employment" value="employment" />
        <Tab label="Interactions" value="interactions" />
      </Tabs>
    </Box>
  );
};
export default ProfileNav;
