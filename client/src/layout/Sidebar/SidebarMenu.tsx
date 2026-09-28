import {
  Avatar,
  Box,
  Collapse,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from '@mui/material';
import { Link, matchPath, useLocation } from 'react-router-dom';
import { SIDEBAR_ITEMS, SidebarGroupItem, SidebarLinkItem } from './constants';

import { DarkModeToggle } from '../../features/dark-mode/DarkModeToggle';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '../../auth/hooks/useAuth';
import { useState } from 'react';

interface SidebarMenuProps {
  onItemClick?: () => void;
}

interface SidebarLinkProps {
  item: SidebarLinkItem;
  isNested?: boolean;
  onClick?: () => void;
}

interface SidebarGroupProps {
  item: SidebarGroupItem;
  onItemClick?: () => void;
}

const buttonStyle = {
  borderRadius: 2,
  py: 1,
  '& .MuiListItemIcon-root': { minWidth: 40, color: 'text.secondary' },
  '&.Mui-selected, &.Mui-selected .MuiListItemIcon-root': { color: 'primary.main' },
} as const;

const isLinkActive = (item: SidebarLinkItem, pathname: string) =>
  [item.path, ...(item.relatedPaths ?? [])].some((path) => matchPath({ path, end: false }, pathname));

const SidebarLink = ({ item, isNested = false, onClick }: SidebarLinkProps) => {
  const { pathname } = useLocation();
  const isActive = isLinkActive(item, pathname);
  const Icon = isActive ? item.activeIcon : item.icon;

  return (
    <ListItem disablePadding sx={{ mb: 0.5 }}>
      <ListItemButton
        component={Link}
        to={item.path}
        selected={isActive}
        aria-current={isActive ? 'page' : undefined}
        onClick={onClick}
        sx={[buttonStyle, isNested && { pl: 4 }]}
      >
        <ListItemIcon>
          <Icon />
        </ListItemIcon>
        <ListItemText primary={item.name} slotProps={{ primary: { fontWeight: isActive ? 600 : 500 } }} />
      </ListItemButton>
    </ListItem>
  );
};

const SidebarGroup = ({ item, onItemClick }: SidebarGroupProps) => {
  const { pathname } = useLocation();
  const hasActiveChild = item.children.some((child) => isLinkActive(child, pathname));
  // Starts open when the current page is inside it.
  const [isOpen, setIsOpen] = useState(hasActiveChild);
  const Icon = hasActiveChild ? item.activeIcon : item.icon;

  return (
    <ListItem disablePadding sx={{ display: 'block' }}>
      <ListItemButton
        aria-expanded={isOpen}
        onClick={() => setIsOpen((wasOpen) => !wasOpen)}
        sx={[
          buttonStyle,
          { mb: 0.5 },
          hasActiveChild && { color: 'primary.main', '& .MuiListItemIcon-root': { color: 'primary.main' } },
        ]}
      >
        <ListItemIcon>
          <Icon />
        </ListItemIcon>
        <ListItemText primary={item.name} slotProps={{ primary: { fontWeight: hasActiveChild ? 600 : 500 } }} />
        {isOpen ? (
          <ExpandLessIcon sx={{ color: 'text.secondary' }} />
        ) : (
          <ExpandMoreIcon sx={{ color: 'text.secondary' }} />
        )}
      </ListItemButton>
      <Collapse in={isOpen} timeout="auto" unmountOnExit>
        <List disablePadding>
          {item.children.map((child) => (
            <SidebarLink key={child.path} item={child} isNested onClick={onItemClick} />
          ))}
        </List>
      </Collapse>
    </ListItem>
  );
};

// Lines up the avatar with the link icons and the name with the link names.
const SidebarUser = () => {
  const { user } = useAuth();

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 3, pt: 3, pb: 2 }}>
      <Avatar alt={user?.name} src={user?.thumbnailUrl ?? undefined} sx={{ width: 32, height: 32 }} />
      <Typography fontWeight={600}>{user?.name}</Typography>
    </Box>
  );
};

const LogoutButton = () => {
  const { logout } = useAuth();

  return (
    <ListItem disablePadding>
      <ListItemButton onClick={() => logout()} sx={buttonStyle}>
        <ListItemIcon>
          <LogoutIcon />
        </ListItemIcon>
        <ListItemText primary="Log out" slotProps={{ primary: { fontWeight: 500 } }} />
      </ListItemButton>
    </ListItem>
  );
};

/** The logged in user, the main menu links with the current page highlighted, log out, and the dark mode switch. */
export const SidebarMenu = ({ onItemClick }: SidebarMenuProps) => {
  return (
    <>
      {/* Keeps the menu below the nav bar. */}
      <Toolbar />
      <SidebarUser />
      <Divider sx={{ mx: 1.5 }} />
      <List sx={{ px: 1.5, py: 2 }}>
        {SIDEBAR_ITEMS.map((item) =>
          'children' in item ? (
            <SidebarGroup key={item.name} item={item} onItemClick={onItemClick} />
          ) : (
            <SidebarLink key={item.path} item={item} onClick={onItemClick} />
          )
        )}
        <Divider component="li" sx={{ my: 1.5 }} />
        <LogoutButton />
      </List>
      {/* The drawer is a flex column, so this pushes the switch to the bottom. */}
      <Box sx={{ display: 'flex', mt: 'auto', px: 3, py: 2 }}>
        <DarkModeToggle />
      </Box>
    </>
  );
};
