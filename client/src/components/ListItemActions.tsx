import { IconButton, Menu, MenuItem, Stack } from '@mui/material';

import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { useState } from 'react';

interface ListItemActionsProps {
  onEdit: () => void;
  onDelete: () => void;
}

/**
 * The "..." button at the end of a list item or table row, with a menu to edit or delete it.
 */
export const ListItemActions = ({ onEdit, onDelete }: ListItemActionsProps) => {
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const isMenuOpen = menuAnchor !== null;

  // Closes the menu first, so it does not stay open behind the dialog that the action opens.
  const handleSelect = (action: () => void) => () => {
    setMenuAnchor(null);
    action();
  };

  return (
    <Stack direction="row" alignItems="center" justifyContent="flex-end" paddingRight={1}>
      <IconButton
        aria-label="More actions"
        aria-haspopup="menu"
        aria-expanded={isMenuOpen}
        onClick={(event) => setMenuAnchor(event.currentTarget)}
      >
        <MoreHorizIcon />
      </IconButton>
      <Menu
        anchorEl={menuAnchor}
        open={isMenuOpen}
        onClose={() => setMenuAnchor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem onClick={handleSelect(onEdit)}>Edit</MenuItem>
        <MenuItem onClick={handleSelect(onDelete)} sx={{ color: 'error.main' }}>
          Delete
        </MenuItem>
      </Menu>
    </Stack>
  );
};
