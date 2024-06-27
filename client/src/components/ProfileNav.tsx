import { Box, Tab, Tabs } from "@mui/material";
import { ProfileNavProps } from "../types";

/**
 * Component for navigating between trainee profile page tabs.
 *
 * @param {string} activeTab trainee id.
 * @param {string} onTabChange callback for when tab is changed.
 * @returns {ReactNode} A React element that renders trainee profile page tabs and active tab logic.
 */
export const ProfileNav = ({ activeTab, onTabChange }: ProfileNavProps) => {
  return (
    <Box display="flex" color="black" sx={{ mx: 5, my: 1 }}>
      <Tabs
        value={activeTab}
        onChange={(_, value) => onTabChange(value)}
        aria-label="basic tabs example"
        variant="fullWidth"
      >
        <Tab label="Personal" value="personal" />
        <Tab label="Contact" value="contact" />
        <Tab label="Education" value="education" />
        <Tab label="Employment" value="employment" />
      </Tabs>
    </Box>
  );
};
