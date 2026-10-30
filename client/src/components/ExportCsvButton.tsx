import { Avatar, Button, alpha } from '@mui/material';

import { ConfirmationDialog } from './ConfirmationDialog';
import DownloadIcon from '@mui/icons-material/Download';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';

interface ExportCsvButtonProps {
  // Downloads the CSV of what the list shows; when it rejects, the error's message is shown in the dialog.
  exportCsv: () => Promise<void>;
}

/** Downloads the list as a CSV file with the filters of the page, once the user has confirmed the care it needs. */
export const ExportCsvButton = ({ exportCsv }: ExportCsvButtonProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  // A mutation, so a 401 ends the session like for any other request.
  const { mutate, isPending, error, reset } = useMutation({
    mutationFn: exportCsv,
    onSuccess: () => setIsDialogOpen(false),
  });
  // Reset, so a failure shown last time does not open with the dialog.
  const open = () => {
    reset();
    setIsDialogOpen(true);
  };

  return (
    <>
      <Button variant="outlined" startIcon={<DownloadIcon />} onClick={open}>
        Export CSV
      </Button>
      <ConfirmationDialog
        isOpen={isDialogOpen}
        title="Export personal information"
        icon={<DownloadIcon />}
        message="The CSV file contains personal information of the people in the list and must be handled with care: store it safely, share it only with those who need it, and delete it when you are done."
        confirmButtonText="Confirm and Download"
        isLoading={isPending}
        error={error?.message}
        onConfirm={() => mutate()}
        onCancel={() => setIsDialogOpen(false)}
      />
    </>
  );
};
