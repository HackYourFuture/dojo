import { ComingSoon } from '../../../components';
import UsersOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined';
import { useEffect } from 'react';

/**
 * Component for displaying the users admin page. A placeholder until the feature is built.
 */
const UsersPage = () => {
  useEffect(() => {
    document.title = 'Users | Dojo';
  }, []);

  return (
    <ComingSoon
      title="Users"
      description="Here you will be able to manage who can sign in to Dojo. This page is under development."
      icon={UsersOutlinedIcon}
    />
  );
};

export default UsersPage;
