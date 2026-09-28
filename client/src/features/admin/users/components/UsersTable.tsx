import {
  Alert,
  Avatar,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';

import { ConfirmationDialog } from '../../../../components/ConfirmationDialog';
import { ListItemActions } from '../../../../components/ListItemActions';
import { User } from '../models/user';
import { useDeleteUser } from '../data/mutations';
import { useState } from 'react';

interface UsersTableProps {
  users: User[];
  onClickEdit: (id: string) => void;
}

const headerStyle = {
  fontWeight: 'bold',
};

/** The users in a table, with a "..." menu on every row to edit or delete the user. */
export const UsersTable = ({ users, onClickEdit }: UsersTableProps) => {
  const { mutate: deleteUser, isPending: isDeleteLoading } = useDeleteUser();
  const [error, setError] = useState<string>('');
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const handleClickOnDeleteButton = (user: User) => {
    setError('');
    setUserToDelete(user);
    setIsDialogOpen(true);
  };

  const onConfirmDelete = () => {
    if (!userToDelete) {
      return;
    }
    deleteUser(userToDelete.id, {
      onSuccess: () => {
        setIsDialogOpen(false);
      },
      onError: (error) => {
        // Close the dialog so the error above the table is visible.
        setIsDialogOpen(false);
        setError(error.message);
      },
    });
  };

  const onCancelDelete = () => {
    setIsDialogOpen(false);
  };

  return (
    <>
      <ConfirmationDialog
        confirmButtonText="Delete"
        isOpen={isDialogOpen}
        title="Confirm Delete"
        message={`Are you sure you want to delete the following user: ${userToDelete?.name}`}
        isLoading={isDeleteLoading}
        onConfirm={onConfirmDelete}
        onCancel={onCancelDelete}
      />
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <TableContainer component={Paper}>
        <Table size="small" aria-label="users table">
          <TableHead>
            <TableRow>
              <TableCell sx={headerStyle} width={50}></TableCell>
              <TableCell sx={headerStyle}>ID</TableCell>
              <TableCell sx={headerStyle}>Name</TableCell>
              <TableCell sx={headerStyle}>Email</TableCell>
              <TableCell sx={headerStyle}>Active</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell>
                  <Avatar src={user.thumbnailUrl ?? undefined} alt={user.name} />
                </TableCell>
                <TableCell>{user.id}</TableCell>
                <TableCell component="th" scope="row">
                  {user.name}
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  {user.isActive ? (
                    <Chip label="Active" color="success" size="small" />
                  ) : (
                    <Chip label="Inactive" size="small" />
                  )}
                </TableCell>
                <TableCell align="right">
                  <ListItemActions
                    onEdit={() => onClickEdit(user.id)}
                    onDelete={() => handleClickOnDeleteButton(user)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};
