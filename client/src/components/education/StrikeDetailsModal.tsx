import {
  Alert,
  Backdrop,
  Box,
  Button,
  Fade,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from '@mui/material';
import { Strike, StrikeReason } from '../../models';
import { useEffect, useState } from 'react';

import { LoadingButton } from '@mui/lab';
import { formatDate } from '../../helpers/dateHelper';

interface StrikeDetailsModalProps {
  isOpen: boolean;
  error: string;
  isLoading: boolean;
  onClose: () => void;
  onConfirmAdd: (strike: Strike) => void;
  onConfirmEdit: (strike: Strike) => void;
  strikeToEdit: Strike | null;
}

export const StrikeDetailsModal = ({
  isOpen,
  isLoading,
  error,
  onClose,
  onConfirmAdd,
  onConfirmEdit,
  strikeToEdit,
}: StrikeDetailsModalProps) => {
  const [strikeFields, setStrikeFields] = useState<Strike>({
    id: '',
    date: new Date(),
    reporterID: '',
    reason: StrikeReason.Other,
    comments: '',
  } as Strike);

  const [commentsRequiredError, setCommentsRequiredError] = useState<boolean>(false);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);

  useEffect(() => {
    if (strikeToEdit) {
      setStrikeFields(strikeToEdit);
      setIsEditMode(true);
      return;
    }
    resetForm();
  }, [strikeToEdit]);

  const resetForm = () => {
    setStrikeFields({
      id: '',
      date: new Date(),
      reporterID: '',
      reason: StrikeReason.Other,
      comments: '',
    } as Strike);

    setCommentsRequiredError(false);
  };

  const handleClose = () => {
    onClose();
    resetForm();
  };
  const handleStrikeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setStrikeFields((prevStrike: Strike) => ({
      ...prevStrike,
      [name]: name === 'date' ? new Date(value) : value,
    }));
  };

  const handleStrikeSelectChange = (event: SelectChangeEvent<string>) => {
    const { name, value } = event.target;

    setStrikeFields(
      (prevStrike: Strike): Strike => ({
        ...prevStrike,
        [name]: value,
      })
    );
  };

  const onConfirm = async () => {
    if (!strikeFields.comments) {
      setCommentsRequiredError(true);
      return;
    }

    strikeToEdit ? onConfirmEdit(strikeFields) : onConfirmAdd(strikeFields);
  };

  //TODO: Add text validation
  const onChangeComments = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCommentsRequiredError(false);
    const { name, value } = e.target;

    setStrikeFields((prevStrike) => ({
      ...prevStrike,
      [name]: value,
    }));
  };

  return (
    <Modal
      open={isOpen}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={isOpen}>
        <Box
          minWidth={550}
          component="form"
          display="flex"
          flexDirection="column"
          gap={3}
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" mb={0.5}>
            {isEditMode ? 'Edit a strike' : 'Add a new strike'}
          </Typography>
          <Box display="flex" flexDirection="row" gap={2}>
            <FormControl fullWidth>
              <TextField
                disabled={isLoading}
                id={strikeFields?.date ? 'date' : 'dateEmpty'}
                name="date"
                label="Date"
                type="date"
                value={formatDate(strikeFields.date)}
                InputLabelProps={{ shrink: true }}
                onChange={handleStrikeChange}
                fullWidth
              />
            </FormControl>
            <FormControl fullWidth>
              <InputLabel htmlFor="reason">Reason</InputLabel>
              <Select
                disabled={isLoading}
                name="reason"
                id="reason"
                label="Reason"
                value={strikeFields.reason}
                startAdornment=" "
                onChange={handleStrikeSelectChange}
              >
                <MenuItem value={StrikeReason.LastSubmission}>Last submission</MenuItem>
                <MenuItem value={StrikeReason.MissedSubmission}>Missed submission</MenuItem>
                <MenuItem value={StrikeReason.IncompleteSubmission}>Incomplete submission</MenuItem>
                <MenuItem value={StrikeReason.LateAttendance}>Late attendance</MenuItem>
                <MenuItem value={StrikeReason.Absence}>Absence</MenuItem>
                <MenuItem value={StrikeReason.PendingFeedback}>Pending feedback</MenuItem>
                <MenuItem value={StrikeReason.Other}>Other</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <FormControl fullWidth>
            <TextField
              required
              sx={{
                lineHeight: 2,
              }}
              disabled={isLoading}
              id="comments"
              name="comments"
              label="Comments"
              type="text"
              multiline
              minRows={2}
              maxRows={4}
              error={commentsRequiredError}
              helperText={commentsRequiredError ? 'Comments are required' : ''}
              value={strikeFields.comments}
              InputLabelProps={{ shrink: true }}
              onChange={onChangeComments}
              fullWidth
            />
          </FormControl>
          {error && <Alert severity="error">{error}</Alert>}

          <Box display="flex" flexDirection="row" gap={2} alignSelf="flex-end">
            <Button variant="outlined" disabled={isLoading} onClick={handleClose} fullWidth>
              Cancel
            </Button>
            <LoadingButton loading={isLoading} disabled={isLoading} variant="contained" onClick={onConfirm} fullWidth>
              {isEditMode ? 'Edit' : 'Add'}
            </LoadingButton>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};
