import { ComingSoon } from '../../components';
import VolunteerOutlinedIcon from '@mui/icons-material/VolunteerActivismOutlined';
import { useEffect } from 'react';

/**
 * Component for displaying the volunteers page. A placeholder until the feature is built.
 */
const VolunteersPage = () => {
  useEffect(() => {
    document.title = 'Volunteers | Dojo';
  }, []);

  return (
    <ComingSoon
      title="Volunteers"
      description="Here you will be able to manage mentors and other volunteers. This page is under development."
      icon={VolunteerOutlinedIcon}
    />
  );
};

export default VolunteersPage;
