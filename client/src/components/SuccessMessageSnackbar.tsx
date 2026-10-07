import { Alert, Snackbar } from '@mui/material';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';

/** Shows the `successMessage` that the previous page passed in the navigation state, like after a delete. */
export const SuccessMessageSnackbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const stateMessage: string | undefined = location.state?.successMessage;
  // Copied, as the effect below clears it from the navigation state as soon as the page opens.
  const [message] = useState(stateMessage);
  const [isOpen, setIsOpen] = useState(stateMessage !== undefined);

  // Cleared from the history entry, so going back to the page does not show it again.
  useEffect(() => {
    if (stateMessage !== undefined) {
      navigate(location.pathname, { replace: true, state: null, preventScrollReset: true });
    }
  }, [location.pathname, stateMessage, navigate]);

  const close = () => setIsOpen(false);

  return (
    <Snackbar
      open={isOpen}
      autoHideDuration={6000}
      onClose={close}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert elevation={6} variant="filled" onClose={close} severity="success">
        {message}
      </Alert>
    </Snackbar>
  );
};
