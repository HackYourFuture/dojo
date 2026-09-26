import {
  Alert,
  Backdrop,
  Box,
  Button,
  Fade,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from '@mui/material';
import { Assessment, AssessmentResult, AssessmentType } from '../models/assessment';

import { formatDate } from '../../../utils/dateHelper';
import { useState } from 'react';

type AssessmentDetailsModalProps = {
  isOpen: boolean;
  isLoading: boolean;
  error?: string;
  onClose: () => void;
  onConfirmAdd: (assessment: Assessment) => void;
  onConfirmEdit: (assessment: Assessment) => void;
  initialAssessment: Assessment | null;
};

// The inputs give text: the date as YYYY-MM-DD and the score as a number string.
const parseInputValue = (name: string, value: string) => {
  if (name === 'date') return value ? new Date(value) : undefined;
  if (name === 'score') return value === '' ? null : Number(value);
  return value;
};

export const AssessmentDetailsModal = ({
  isOpen,
  isLoading,
  error,
  onClose,
  onConfirmAdd,
  onConfirmEdit,
  initialAssessment,
}: AssessmentDetailsModalProps) => {
  const [assessmentFields, setAssessmentFields] = useState<Partial<Assessment>>({
    id: initialAssessment?.id || '',
    date: initialAssessment?.date || new Date(),
    type: initialAssessment?.type || undefined,
    score: initialAssessment?.score ?? null,
    result: initialAssessment?.result || undefined,
    comments: initialAssessment?.comments || '',
  });

  const [typeError, setTypeError] = useState(false);
  const [dateError, setDateError] = useState(false);
  const [resultError, setResultError] = useState(false);
  const [scoreError, setScoreError] = useState(false);

  const isEditMode = Boolean(initialAssessment);

  const handleClose = () => {
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === 'score') setScoreError(false);
    if (name === 'date') setDateError(false);

    setAssessmentFields((prevAssessment) => ({
      ...prevAssessment,
      [name]: parseInputValue(name, value),
    }));
  };

  const handleAssessmentSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    if (name === 'type') setTypeError(false);
    if (name === 'result') setResultError(false);

    setAssessmentFields((prev) => ({
      ...prev,
      [name]: name === 'type' ? (value as AssessmentType) : name === 'result' ? (value as AssessmentResult) : value,
    }));
  };

  const onConfirm = () => {
    let invalid = false;
    if (!assessmentFields.type) {
      setTypeError(true);
      invalid = true;
    }
    if (!assessmentFields.date) {
      setDateError(true);
      invalid = true;
    }
    if (!assessmentFields.result) {
      setResultError(true);
      invalid = true;
    }
    if (assessmentFields.score && (assessmentFields.score < 0 || assessmentFields.score > 10)) {
      setScoreError(true);
      invalid = true;
    }
    if (invalid) return;

    if (isEditMode) onConfirmEdit(assessmentFields as Assessment);
    else onConfirmAdd(assessmentFields as Assessment);
  };

  return (
    <Modal open={isOpen} closeAfterTransition BackdropComponent={Backdrop} BackdropProps={{ timeout: 500 }}>
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
            {isEditMode ? 'Edit assessment' : 'Add new assessment'}
          </Typography>

          <Box display="flex" flexDirection="row" gap={2}>
            <FormControl fullWidth error={typeError}>
              <InputLabel htmlFor="type">Assessment type</InputLabel>
              <Select
                disabled={isLoading}
                name="type"
                id="type"
                label="Assessment type"
                value={assessmentFields.type ?? ''}
                onChange={handleAssessmentSelectChange}
              >
                <MenuItem value={AssessmentType.CoreMidTermInterview}>Core mid-term interview</MenuItem>
                <MenuItem value={AssessmentType.CoreEndInterview}>Core end interview</MenuItem>
                <MenuItem value={AssessmentType.FrontEndMidTermInterview}>Frontend mid-term interview</MenuItem>
                <MenuItem value={AssessmentType.BackEndMidTermInterview}>Backend mid-term interview</MenuItem>
                <MenuItem value={AssessmentType.CloudMidTermInterview}>Cloud mid-term interview</MenuItem>
                <MenuItem value={AssessmentType.DataMidTermInterview}>Data mid-term interview</MenuItem>
                <MenuItem value={AssessmentType.TesterMidTermInterview}>Tester mid-term interview</MenuItem>
              </Select>
              {typeError && <FormHelperText>Type is required</FormHelperText>}
            </FormControl>

            <FormControl fullWidth error={dateError}>
              <TextField
                error={dateError}
                disabled={isLoading}
                id={assessmentFields?.date ? 'date' : 'dateEmpty'}
                name="date"
                label="Assessment date"
                type="date"
                value={formatDate(assessmentFields.date)}
                InputLabelProps={{ shrink: true }}
                onChange={handleChange}
                fullWidth
              />
              {dateError && <FormHelperText>Date is required</FormHelperText>}
            </FormControl>
          </Box>

          <Box display="flex" gap={2}>
            <FormControl fullWidth error={resultError}>
              <InputLabel htmlFor="result">Result</InputLabel>
              <Select
                disabled={isLoading}
                name="result"
                id="result"
                label="Result"
                value={assessmentFields.result ?? ''}
                onChange={handleAssessmentSelectChange}
              >
                <MenuItem value={AssessmentResult.Passed}>Passed</MenuItem>
                <MenuItem value={AssessmentResult.PassedWithWarning}>Passed with warning</MenuItem>
                <MenuItem value={AssessmentResult.Failed}>Failed</MenuItem>
                <MenuItem value={AssessmentResult.Disqualified}>Disqualified</MenuItem>
              </Select>
              {resultError && <FormHelperText>Result is required</FormHelperText>}
            </FormControl>

            <FormControl fullWidth error={scoreError}>
              <TextField
                error={scoreError}
                disabled={isLoading}
                id="score"
                name="score"
                label="Score"
                type="number"
                inputProps={{ min: 0, max: 10, step: 0.1 }}
                value={assessmentFields.score ?? ''}
                onChange={handleChange}
                fullWidth
              />
              {scoreError && <FormHelperText>Score from 0 to 10 is required</FormHelperText>}
            </FormControl>
          </Box>

          <FormControl fullWidth>
            <TextField
              disabled={isLoading}
              id="comments"
              name="comments"
              label="Comments"
              type="text"
              multiline
              minRows={2}
              maxRows={4}
              value={assessmentFields.comments || ''}
              InputLabelProps={{ shrink: true }}
              onChange={handleChange}
              fullWidth
            />
          </FormControl>

          {error && <Alert severity="error">{error}</Alert>}

          <Box display="flex" gap={2} alignSelf="flex-end">
            <Button variant="outlined" disabled={isLoading} onClick={handleClose} fullWidth>
              Cancel
            </Button>
            <Button loading={isLoading} disabled={isLoading} variant="contained" onClick={onConfirm} fullWidth>
              Save
            </Button>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};
