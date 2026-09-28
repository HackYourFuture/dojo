import { IconButton, Stack } from '@mui/material';

import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

interface ListItemActionsProps {
  onEdit: () => void;
  onDelete: () => void;
}

/**
 * The edit and delete buttons at the end of an item in the lists of the profile tabs.
 */
export const ListItemActions = ({ onEdit, onDelete }: ListItemActionsProps) => (
  <Stack direction="row" alignItems="center" justifyContent="flex-end" paddingRight={1}>
    <IconButton aria-label="edit" onClick={onEdit}>
      <EditIcon />
    </IconButton>
    <IconButton aria-label="delete" onClick={onDelete}>
      <DeleteIcon />
    </IconButton>
  </Stack>
);
