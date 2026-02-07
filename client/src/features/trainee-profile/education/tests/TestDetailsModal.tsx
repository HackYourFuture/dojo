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
import { Test, TestResult, TestType } from '../../../../data/types/Trainee';

import { LoadingButton } from '@mui/lab';
import { formatDate } from '../../utils/dateHelper';
import { useState } from 'react';

type TestDetailsModalProps = {
  isOpen: boolean;
  isLoading: boolean;
  error?: string;
  onClose: () => void;
  onConfirmAdd: (t: Test) => void;
  onConfirmEdit: (t: Test) => void;
  initialTest: Test | null;
};

export const TestDetailsModal = ({
  isOpen,
  isLoading,
  error,
  onClose,
  onConfirmAdd,
  onConfirmEdit,
  initialTest,
}: TestDetailsModalProps) => {
  const [testFields, setTestFields] = useState<Partial<Test>>({
    id: initialTest?.id || '',
    date: initialTest?.date || new Date(),
    type: initialTest?.type || undefined,
    score: initialTest?.score ?? undefined,
    result: initialTest?.result || undefined,
    comments: initialTest?.comments || '',
  });

  const [typeError, setTypeError] = useState(false);
  const [resultError, setResultError] = useState(false);
  const [scoreError, setScoreError] = useState(false);

  const isEditMode = Boolean(initialTest);

  const handleClose = () => {
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === 'score') setScoreError(false);

    setTestFields((prevTest) => ({
      ...prevTest,
      [name]: name === 'date' ? new Date(value) : name === 'score' ? (value === '' ? undefined : Number(value)) : value,
    }));
  };

  const handleTestSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    if (name === 'type') setTypeError(false);
    if (name === 'result') setResultError(false);

    setTestFields((prev) => ({
      ...prev,
      [name]: name === 'type' ? (value as TestType) : name === 'result' ? (value as TestResult) : value,
    }));
  };

  const onConfirm = () => {
    let invalid = false;
    if (!testFields.type) {
      setTypeError(true);
      invalid = true;
    }
    if (!testFields.result) {
      setResultError(true);
      invalid = true;
    }
    if (testFields.score && (testFields.score < 0 || testFields.score > 10)) {
      setScoreError(true);
      invalid = true;
    }
    if (invalid) return;

    if (isEditMode) onConfirmEdit(testFields as Test);
    else onConfirmAdd(testFields as Test);
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
            {isEditMode ? 'Edit test' : 'Add new test'}
          </Typography>

          <Box display="flex" flexDirection="row" gap={2}>
            <FormControl fullWidth error={typeError}>
              <InputLabel htmlFor="type">Test type</InputLabel>
              <Select
                disabled={isLoading}
                name="type"
                id="type"
                label="Test type"
                value={testFields.type ?? ''}
                onChange={handleTestSelectChange}
              >
                <MenuItem value={TestType.Presentation}>Presentation</MenuItem>
                <MenuItem value={TestType.JavaScript}>JavaScript</MenuItem>
                <MenuItem value={TestType.BrowsersInterview}>Browsers interview</MenuItem>
                <MenuItem value={TestType.UsingApisInterview}>Using APIs interview</MenuItem>
                <MenuItem value={TestType.NodeJS}>Node.js</MenuItem>
                <MenuItem value={TestType.ReactInterview}>React interview</MenuItem>
                <MenuItem value={TestType.FinalProjectInterview}>Final project interview</MenuItem>
              </Select>
              {typeError && <FormHelperText>Type is required</FormHelperText>}
            </FormControl>

            <FormControl fullWidth>
              <TextField
                disabled={isLoading}
                id={testFields?.date ? 'date' : 'dateEmpty'}
                name="date"
                label="Test Date"
                type="date"
                value={formatDate(testFields.date)}
                InputLabelProps={{ shrink: true }}
                onChange={handleChange}
                fullWidth
              />
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
                value={testFields.result ?? ''}
                onChange={handleTestSelectChange}
              >
                <MenuItem value={TestResult.Passed}>Passed</MenuItem>
                <MenuItem value={TestResult.PassedWithWarning}>Passed with warning</MenuItem>
                <MenuItem value={TestResult.Failed}>Failed</MenuItem>
                <MenuItem value={TestResult.Disqualified}>Disqualified</MenuItem>
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
                value={testFields.score ?? ''}
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
              value={testFields.comments || ''}
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
            <LoadingButton loading={isLoading} disabled={isLoading} variant="contained" onClick={onConfirm} fullWidth>
              Save
            </LoadingButton>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};
