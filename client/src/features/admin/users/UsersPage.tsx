import { Box, Button, Container, Typography } from '@mui/material';
import { ErrorBox, Loader } from '../../../components';
import { useAddUser, useEditUser } from './data/mutations';
import { useEffect, useState } from 'react';

import AddIcon from '@mui/icons-material/Add';
import { User } from './models/user';
import { UserDetailsDialog } from './components/UserDetailsDialog';
import { UsersTable } from './components/UsersTable';
import { useGetUsers } from './data/user-queries';

/**
 * Component for displaying the users admin page, where users who can sign in to Dojo are added, edited and deleted.
 */
const UsersPage = () => {
  useEffect(() => {
    document.title = 'Users | Dojo';
  }, []);

  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [dialogError, setDialogError] = useState<string>('');
  const [userToEdit, setUserToEdit] = useState<User | null>(null);

  const { data: users, isPending, error } = useGetUsers();
  const { mutate: addUser, isPending: isAddLoading } = useAddUser();
  const { mutate: editUser, isPending: isEditLoading } = useEditUser();

  const closeDialog = () => {
    setIsDialogOpen(false);
    setUserToEdit(null);
    setDialogError('');
  };

  const onClickAdd = () => {
    setIsDialogOpen(true);
  };

  const onClickEdit = (id: string) => {
    setUserToEdit(users?.find((user) => user.id === id) ?? null);
    setIsDialogOpen(true);
  };

  const onConfirmAdd = (user: User) => {
    setDialogError('');
    addUser(user, {
      onSuccess: closeDialog,
      onError: (e) => {
        setDialogError(e.message);
      },
    });
  };

  const onConfirmEdit = (user: User) => {
    setDialogError('');
    editUser(user, {
      onSuccess: closeDialog,
      onError: (e) => {
        setDialogError(e.message);
      },
    });
  };

  return (
    <Container fixed>
      <Box p={2}>
        <Typography variant="h4">Users</Typography>
        <Box sx={{ my: 2, py: 2, pr: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="contained" startIcon={<AddIcon />} onClick={onClickAdd}>
            Add User
          </Button>
        </Box>
        {isPending && (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <Loader />
          </Box>
        )}
        {error && <ErrorBox errorMessage={error.message} />}
        {users && <UsersTable users={users} onClickEdit={onClickEdit} />}
      </Box>

      <UserDetailsDialog
        key={userToEdit?.id || `add-user-${isDialogOpen}`} // A new key on every open and close resets the form
        isOpen={isDialogOpen}
        isLoading={isAddLoading || isEditLoading}
        error={dialogError}
        onClose={closeDialog}
        onConfirmAdd={onConfirmAdd}
        onConfirmEdit={onConfirmEdit}
        initialUser={userToEdit}
      />
    </Container>
  );
};

export default UsersPage;
