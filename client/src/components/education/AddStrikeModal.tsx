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
  TextField,
  Typography,
} from '@mui/material';
import { Strike, StrikeReason } from '../../models';

import { LoadingButton } from '@mui/lab';
import { formatDate } from './EducationInfo';
import { useState } from 'react';

interface AddStrikeModalProps {
  isOpen: boolean;
  error: string;
  isLoading: boolean;
  onClose: () => void;
  onConfirm: (strike: Strike) => void;
}

export const AddStrikeModal = ({ isOpen, isLoading, error, onClose, onConfirm }: AddStrikeModalProps) => {
  const [strikeFields, setStrikeFields] = useState<Strike>({
    id: '',
    date: new Date(),
    reporterID: '',
    reason: StrikeReason.Other,
    comments: '',
  });

  const [commentsRequiredError, setCommentsRequiredError] = useState(false);

  const resetForm = () => {
    setStrikeFields({
      id: '',
      date: new Date(),
      reporterID: '',
      reason: StrikeReason.Other,
      comments: '',
    });
    setCommentsRequiredError(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };
  const handleStrikeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    //@ts-ignore
    setStrikeFields((prevStrike) => ({
      ...prevStrike,
      [name]: name === 'date' ? new Date(value) : value,
    }));
  };

  const onClickAddStrike = () => {
    if (!strikeFields.comments) {
      setCommentsRequiredError(true);
      return;
    }
    onConfirm(strikeFields);
    resetForm();
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
          component="form"
          display="flex"
          flexDirection="column"
          gap={2}
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" mb={0.5}>
            Adding a strike:
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
                onChange={handleStrikeChange}
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
              disabled={isLoading}
              id="comments"
              name="comments"
              label="Comments"
              type="text"
              multiline
              error={commentsRequiredError}
              helperText={commentsRequiredError ? 'Comments are required' : ''}
              value={strikeFields.comments}
              InputLabelProps={{ shrink: true }}
              onChange={onChangeComments}
              fullWidth
            />
          </FormControl>
          {error && <Alert severity="error">{error}</Alert>}

          <Box display="flex" flexDirection="row" gap={2}>
            <LoadingButton
              loading={isLoading}
              disabled={isLoading}
              variant="contained"
              onClick={onClickAddStrike}
              fullWidth
            >
              Add Strike
            </LoadingButton>
            <Button variant="outlined" disabled={isLoading} onClick={handleClose} fullWidth>
              Cancel
            </Button>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};
