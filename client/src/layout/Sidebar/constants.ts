import AdminIcon from '@mui/icons-material/AdminPanelSettings';
import AdminOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import DashboardIcon from '@mui/icons-material/SpaceDashboard';
import DashboardOutlinedIcon from '@mui/icons-material/SpaceDashboardOutlined';
import HandshakeIcon from '@mui/icons-material/Handshake';
import HandshakeOutlinedIcon from '@mui/icons-material/HandshakeOutlined';
import HomeIcon from '@mui/icons-material/Home';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import SchoolIcon from '@mui/icons-material/School';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import { SvgIcon } from '@mui/material';
import UsersIcon from '@mui/icons-material/ManageAccounts';
import UsersOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined';
import VolunteerIcon from '@mui/icons-material/VolunteerActivism';
import VolunteerOutlinedIcon from '@mui/icons-material/VolunteerActivismOutlined';

export const SIDEBAR_WIDTH = 240;

export interface SidebarLinkItem {
  name: string;
  path: string;
  icon: typeof SvgIcon;
  activeIcon: typeof SvgIcon;
  // Other routes that belong to this item, so it stays highlighted there.
  relatedPaths?: string[];
}

// An expandable item that holds other links.
export interface SidebarGroupItem {
  name: string;
  icon: typeof SvgIcon;
  activeIcon: typeof SvgIcon;
  children: SidebarLinkItem[];
}

export type SidebarItem = SidebarLinkItem | SidebarGroupItem;

export const SIDEBAR_ITEMS: SidebarItem[] = [
  { name: 'Home', path: '/home', icon: HomeOutlinedIcon, activeIcon: HomeIcon, relatedPaths: ['/search'] },
  {
    name: 'Trainees',
    path: '/trainees',
    icon: SchoolOutlinedIcon,
    activeIcon: SchoolIcon,
    relatedPaths: ['/trainee'],
  },
  { name: 'Volunteers', path: '/volunteers', icon: VolunteerOutlinedIcon, activeIcon: VolunteerIcon },
  { name: 'Partners', path: '/partners', icon: HandshakeOutlinedIcon, activeIcon: HandshakeIcon },
  { name: 'Dashboard', path: '/dashboard', icon: DashboardOutlinedIcon, activeIcon: DashboardIcon },
  {
    name: 'Admin',
    icon: AdminOutlinedIcon,
    activeIcon: AdminIcon,
    children: [{ name: 'Users', path: '/admin/users', icon: UsersOutlinedIcon, activeIcon: UsersIcon }],
  },
];
