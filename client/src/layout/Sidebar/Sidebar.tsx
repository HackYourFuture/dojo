import { Box, Drawer } from '@mui/material';

import { SIDEBAR_WIDTH } from './constants';
import { SidebarMenu } from './SidebarMenu';

interface SidebarProps {
  isMobileOpen: boolean;
  onMobileClose: () => void;
}

const drawerPaperStyle = { '& .MuiDrawer-paper': { width: SIDEBAR_WIDTH, boxSizing: 'border-box' } } as const;

/** The main menu on the left, below the nav bar. Small screens open it from the nav bar menu button. */
export const Sidebar = ({ isMobileOpen, onMobileClose }: SidebarProps) => {
  return (
    <Box component="nav" aria-label="Main menu" sx={{ width: { md: SIDEBAR_WIDTH }, flexShrink: { md: 0 } }}>
      <Drawer
        variant="temporary"
        open={isMobileOpen}
        onClose={onMobileClose}
        slotProps={{ root: { keepMounted: true } }}
        sx={{ display: { xs: 'block', md: 'none' }, ...drawerPaperStyle }}
      >
        <SidebarMenu onItemClick={onMobileClose} />
      </Drawer>
      <Drawer variant="permanent" open sx={{ display: { xs: 'none', md: 'block' }, ...drawerPaperStyle }}>
        <SidebarMenu />
      </Drawer>
    </Box>
  );
};
