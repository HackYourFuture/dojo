import { ComingSoon } from '../../components';
import HandshakeOutlinedIcon from '@mui/icons-material/HandshakeOutlined';
import { useEffect } from 'react';

/**
 * Component for displaying the partners page. A placeholder until the feature is built.
 */
const PartnersPage = () => {
  useEffect(() => {
    document.title = 'Partners | Dojo';
  }, []);

  return (
    <ComingSoon
      title="Partners"
      description="Here you will be able to manage partner companies. This page is under development."
      icon={HandshakeOutlinedIcon}
    />
  );
};

export default PartnersPage;
