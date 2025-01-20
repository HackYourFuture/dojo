import {
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

import { formatDate } from './EducationInfo';
import { useState } from 'react';

interface AddStrikeModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (strike: Strike) => void;
}

export const AddStrikeModal = ({ open, onClose, onConfirm }: AddStrikeModalProps) => {
  const [strikeFields, setStrikeFields] = useState<Strike>({
    id: '',
    date: new Date(),
    reporterID: '',
    reason: StrikeReason.Other,
    comments: '',
  });

  const handleClose = () => {
    setStrikeFields({
      id: '',
      date: new Date(),
      reporterID: '',
      reason: StrikeReason.Other,
      comments: '',
    });
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
    onConfirm(strikeFields);
  };

  //TODO: Add text validation
  const onChangeComments = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setStrikeFields((prevStrike) => ({
      ...prevStrike,
      [name]: value,
    }));
  };

  return (
    <Modal
      open={open}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={open}>
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
              id="comments"
              name="comments"
              label="Comments"
              type="text"
              multiline
              value={strikeFields.comments}
              InputLabelProps={{ shrink: true }}
              onChange={onChangeComments}
              fullWidth
            />
          </FormControl>
          <Box display="flex" flexDirection="row" gap={2}>
            <Button variant="contained" onClick={onClickAddStrike} fullWidth>
              Add Strike
            </Button>
            <Button variant="outlined" onClick={handleClose} fullWidth>
              Cancel
            </Button>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};
