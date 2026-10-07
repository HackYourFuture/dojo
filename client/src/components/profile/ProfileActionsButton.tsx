import { Button, Menu, MenuItem } from '@mui/material';

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useState } from 'react';

export interface ProfileAction {
  label: string;
  onClick: () => void;
  // Shown in red, like deleting the profile.
  isDestructive?: boolean;
}

interface ProfileActionsButtonProps {
  actions: ProfileAction[];
}

/** The Actions button of a profile, with a menu of what can be done with the profile. */
export const ProfileActionsButton = ({ actions }: ProfileActionsButtonProps) => {
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const isMenuOpen = menuAnchor !== null;

  // Closes the menu first, so it does not stay open behind the dialog that the action opens.
  const handleSelect = (action: () => void) => () => {
    setMenuAnchor(null);
    action();
  };

  return (
    <>
      <Button
        variant="outlined"
        endIcon={<KeyboardArrowDownIcon />}
        aria-haspopup="menu"
        aria-expanded={isMenuOpen}
        onClick={(event) => setMenuAnchor(event.currentTarget)}
      >
        Actions
      </Button>
      <Menu
        anchorEl={menuAnchor}
        open={isMenuOpen}
        onClose={() => setMenuAnchor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        {actions.map((action) => (
          <MenuItem
            key={action.label}
            onClick={handleSelect(action.onClick)}
            sx={action.isDestructive ? { color: 'error.main' } : undefined}
          >
            {action.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};
