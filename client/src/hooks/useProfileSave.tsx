import { Alert, Snackbar } from '@mui/material';

import { useState } from 'react';

// The mutate function of a profile's update mutation.
type SaveFunction<Changes> = (
  changes: Changes,
  options: { onSuccess: () => void; onError: (error: Error) => void }
) => void;

interface SaveResult {
  isOpen: boolean;
  severity: 'success' | 'error';
  message: string;
}

// Saves the changes of a profile, named like "Trainee", and gives the snackbar that shows whether it worked.
export const useProfileSave = <Changes extends object>(profileName: string, save: SaveFunction<Changes>) => {
  // Closing keeps the severity and message, so the alert does not change while it fades out.
  const [saveResult, setSaveResult] = useState<SaveResult>({ isOpen: false, severity: 'success', message: '' });
  const lowerCaseName = profileName.toLowerCase();

  // Calls onSaved once the changes are saved, or at once when there is nothing to save, as the API rejects that.
  const saveChanges = (changes: Changes, onSaved: () => void) => {
    if (Object.keys(changes).length === 0) {
      onSaved();
      return;
    }

    save(changes, {
      onSuccess: () => {
        setSaveResult({ isOpen: true, severity: 'success', message: `${profileName} data saved successfully` });
        onSaved();
      },
      onError: (error) => {
        console.error(`There was a problem saving ${lowerCaseName} data:`, error.message);
        // The server validates the whole profile, so its message names the field that blocks the save.
        const message = `Error saving ${lowerCaseName} data: ${error.message}`;
        setSaveResult({ isOpen: true, severity: 'error', message });
      },
    });
  };

  const close = () => {
    setSaveResult((prevSaveResult) => ({ ...prevSaveResult, isOpen: false }));
  };

  const saveResultSnackbar = (
    <Snackbar
      open={saveResult.isOpen}
      autoHideDuration={6000}
      onClose={close}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert elevation={6} variant="filled" onClose={close} severity={saveResult.severity}>
        {saveResult.message}
      </Alert>
    </Snackbar>
  );

  return { saveChanges, saveResultSnackbar };
};
