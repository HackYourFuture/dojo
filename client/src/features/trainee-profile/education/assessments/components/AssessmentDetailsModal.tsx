import {
  Alert,
  Backdrop,
  Box,
  Button,
  Fade,
  FormControl,
  FormHelperText,
  InputLabel,
  ListSubheader,
  MenuItem,
  Modal,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from '@mui/material';
import { Assessment, AssessmentResult, AssessmentType } from '../models/assessment';

import { FormDateField } from '../../../../../components/FormDateField';
import { today } from '../../../../../data/dates';
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

// The inputs give text: the score as a number string.
const parseInputValue = (name: string, value: string) => {
  if (name === 'score') {
    return value === '' ? null : Number(value);
  }
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
    date: initialAssessment?.date || today(),
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

    if (name === 'score') {
      setScoreError(false);
    }

    setAssessmentFields((prevAssessment) => ({
      ...prevAssessment,
      [name]: parseInputValue(name, value),
    }));
  };

  const handleDateChange = (date: Date | null) => {
    setDateError(false);
    setAssessmentFields((prevAssessment) => ({
      ...prevAssessment,
      date: date ?? undefined,
    }));
  };

  const handleAssessmentSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    if (name === 'type') {
      setTypeError(false);
    }
    if (name === 'result') {
      setResultError(false);
    }

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
    if (invalid) {
      return;
    }

    if (isEditMode) {
      onConfirmEdit(assessmentFields as Assessment);
    } else {
      onConfirmAdd(assessmentFields as Assessment);
    }
  };

  return (
    <Modal open={isOpen} closeAfterTransition slots={{ backdrop: Backdrop }} slotProps={{ backdrop: { timeout: 500 } }}>
      <Fade in={isOpen}>
        <Box
          component="form"
          sx={{
            minWidth: 550,
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            {isEditMode ? 'Edit assessment' : 'Add new assessment'}
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
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
                <ListSubheader>Core Program</ListSubheader>
                <MenuItem value={AssessmentType.CoreMidTermInterview}>Core mid-term interview</MenuItem>
                <MenuItem value={AssessmentType.CoreEndInterview}>Core end interview</MenuItem>
                <ListSubheader>Specialization tracks</ListSubheader>
                <MenuItem value={AssessmentType.FrontEndMidTermInterview}>Frontend mid-term interview</MenuItem>
                <MenuItem value={AssessmentType.BackEndMidTermInterview}>Backend mid-term interview</MenuItem>
                <MenuItem value={AssessmentType.CloudMidTermInterview}>Cloud mid-term interview</MenuItem>
                <MenuItem value={AssessmentType.DataMidTermInterview}>Data mid-term interview</MenuItem>
                <MenuItem value={AssessmentType.TesterMidTermInterview}>Tester mid-term interview</MenuItem>
                <ListSubheader>Final project</ListSubheader>
                <MenuItem value={AssessmentType.FinalProjectInterview}>Final project interview</MenuItem>
              </Select>
              {typeError && <FormHelperText>Type is required</FormHelperText>}
            </FormControl>

            <FormControl fullWidth error={dateError}>
              <FormDateField
                error={dateError}
                disabled={isLoading}
                label="Assessment date"
                value={assessmentFields.date}
                onChange={handleDateChange}
              />
              {dateError && <FormHelperText>Date is required</FormHelperText>}
            </FormControl>
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
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
                value={assessmentFields.score ?? ''}
                onChange={handleChange}
                fullWidth
                slotProps={{ htmlInput: { min: 0, max: 10, step: 0.1 } }}
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
              onChange={handleChange}
              fullWidth
              slotProps={{ inputLabel: { shrink: true } }}
            />
          </FormControl>

          {error && <Alert severity="error">{error}</Alert>}

          <Box sx={{ display: 'flex', gap: 2, alignSelf: 'flex-end' }}>
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
