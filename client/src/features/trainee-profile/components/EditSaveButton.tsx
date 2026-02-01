import { LoadingButton } from '@mui/lab';
import { Box, Button } from '@mui/material';

export interface EditSaveButtonProps {
  isEditMode: boolean;
  isLoading: boolean;
  onCancel: () => void;
  onClickEditButton: () => void;
}

export const EditSaveButton = ({ isEditMode, isLoading, onCancel, onClickEditButton }: EditSaveButtonProps) => {
  return (
    <Box display="flex" justifyContent="flex-end" padding="16px" gap={1} marginRight={5}>
      {isEditMode && (
        <Button variant="outlined" disabled={isLoading} onClick={onCancel}>
          Cancel
        </Button>
      )}
      <LoadingButton variant="contained" loading={isLoading} onClick={onClickEditButton}>
        {isEditMode ? 'Save' : 'Edit'}
      </LoadingButton>
    </Box>
  );
};
