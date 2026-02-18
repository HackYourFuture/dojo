import { EmploymentHistory, EmploymentType } from '../../../../data/types/Trainee';
import React, { useState } from 'react';
import {
  Alert,
  Backdrop,
  Box,
  Button,
  Checkbox,
  Fade,
  FormControl,
  FormControlLabel,
  FormHelperText,
  InputAdornment,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from '@mui/material';
import { formatDate } from '../../utils/dateHelper';
import { LoadingButton } from '@mui/lab';

interface EmploymentDetailsModalProps {
  isOpen: boolean;
  error: string;
  isLoading: boolean;
  onClose: () => void;
  onConfirmAdd: (employment: EmploymentHistory) => void;
  onConfirmEdit: (employment: EmploymentHistory) => void;
  initialEmployment: EmploymentHistory | null;
}

export const EmploymentDetailsModal = ({
  isOpen,
  isLoading,
  error,
  onClose,
  onConfirmAdd,
  onConfirmEdit,
  initialEmployment,
}: EmploymentDetailsModalProps) => {
  const [employmentFields, setEmploymentFields] = useState<EmploymentHistory>({
    id: initialEmployment?.id || '',
    type: initialEmployment?.type || '',
    companyName: initialEmployment?.companyName || '',
    role: initialEmployment?.role || '',
    startDate: initialEmployment?.startDate || new Date(),
    endDate: initialEmployment?.endDate,
    feeCollected: initialEmployment?.feeCollected || false,
    feeAmount: initialEmployment?.feeAmount || undefined,
    comments: initialEmployment?.comments || '',
  } as EmploymentHistory);

  const [requiredFieldError, setRequiredFieldError] = useState({
    type: false,
    companyName: false,
    role: false,
    startDate: false,
    feeAmount: false,
  });
  const isEditMode = Boolean(initialEmployment);

  const handleClose = () => {
    onClose();
  };
  const handleEmploymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setEmploymentFields((prevEmployment: EmploymentHistory) => ({
      ...prevEmployment,
      [name]: value,
    }));
  };
  const handleEmploymentCheckChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setEmploymentFields((prevEmployment: EmploymentHistory) => ({
      ...prevEmployment,
      [name]: checked,
    }));
  }

  const handleEmploymentSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;

    setEmploymentFields((prevEmployment: EmploymentHistory) => ({
      ...prevEmployment,
      [name]: value,
    }));
  };

  const onConfirm = async () => {
    const newErrors = {
      type: !employmentFields.type,
      companyName: !employmentFields.companyName,
      role: !employmentFields.role,
      startDate: !employmentFields.startDate,
      feeAmount: employmentFields.feeCollected && (!employmentFields.feeAmount || employmentFields.feeAmount <= 0),
    }

    setRequiredFieldError(newErrors);
    const errors = Object.values(newErrors).some(Boolean)
    if (errors) return;

    if (initialEmployment) {
      onConfirmEdit(employmentFields);
    } else {
      onConfirmAdd(employmentFields);
    }
  };

  return (
    <Modal open={isOpen} closeAfterTransition slots={{ backdrop: Backdrop }} slotProps={{ backdrop: { timeout: 500 } }}>
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
            backgroundColor: 'background.paper',
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" mb={0.5}>
            {isEditMode ? 'Edit employment' : 'Add a new employment'}
          </Typography>
          <Box display="flex" flexDirection="row" gap={2}>
            <FormControl fullWidth>
              <TextField
                required
                disabled={isLoading}
                id="companyName"
                name="companyName"
                label="Company name"
                type="text"
                placeholder="HackYourFuture"
                value={employmentFields.companyName}
                slotProps={{ inputLabel: { shrink: true } }}
                error={requiredFieldError.companyName}
                onChange={handleEmploymentChange}
                fullWidth
              />
              {requiredFieldError.companyName && <FormHelperText error>Company name is required</FormHelperText>}
            </FormControl>
            <FormControl fullWidth>
              <InputLabel htmlFor="employmentType" error={requiredFieldError.type}>
                Type
              </InputLabel>
              <Select
                required
                disabled={isLoading}
                name="type"
                id="type"
                label="Type"
                value={employmentFields.type || ''}
                error={requiredFieldError.type}
                onChange={handleEmploymentSelectChange}
              >
                <MenuItem value={EmploymentType.Internship}>Internship</MenuItem>
                <MenuItem value={EmploymentType.Job}>Job</MenuItem>
              </Select>
              {requiredFieldError.type && <FormHelperText error>Type is required</FormHelperText>}
            </FormControl>
          </Box>
          <FormControl fullWidth>
            <TextField
              required
              disabled={isLoading}
              id="role"
              name="role"
              label="Role"
              type="text"
              placeholder="Fullstack Developer"
              value={employmentFields.role}
              slotProps={{ inputLabel: { shrink: true } }}
              error={requiredFieldError.role}
              onChange={handleEmploymentChange}
              fullWidth
            />
            {requiredFieldError.role && <FormHelperText error>Role is required</FormHelperText>}
          </FormControl>
          <Box display="flex" flexDirection="row" gap={2}>
            <FormControl fullWidth>
              <TextField
                required
                disabled={isLoading}
                id="startDate"
                name="startDate"
                label="Start date"
                type="date"
                value={formatDate(employmentFields.startDate)}
                slotProps={{ inputLabel: { shrink: true } }}
                error={requiredFieldError.startDate}
                onChange={handleEmploymentChange}
                fullWidth
              />
              {requiredFieldError.startDate && <FormHelperText error>Start date is required</FormHelperText>}
            </FormControl>
            <FormControl fullWidth>
              <TextField
                disabled={isLoading}
                id="endDate"
                name="endDate"
                label="End date"
                type="date"
                value={formatDate(employmentFields.endDate)}
                slotProps={{ inputLabel: { shrink: true } }}
                onChange={handleEmploymentChange}
                fullWidth
              />
            </FormControl>
          </Box>
          <Box display="flex" flexDirection="row" gap={2}>
            <FormControl fullWidth>
              <FormControlLabel
                control={
                  <Checkbox
                    disabled={isLoading}
                    id="feeCollected"
                    name="feeCollected"
                    checked={employmentFields.feeCollected}
                    onChange={handleEmploymentCheckChange}
                  />
                }
                label="Fee collected"
              />
            </FormControl>
            <FormControl fullWidth>
              <TextField
                required={employmentFields.feeCollected}
                disabled={isLoading}
                id="feeAmount"
                name="feeAmount"
                label="Fee amount"
                type="number"
                placeholder="4000"
                value={employmentFields.feeAmount}
                slotProps={{
                  inputLabel: { shrink: true },
                  input: { startAdornment: <InputAdornment position="start">€</InputAdornment> },
                }}
                error={requiredFieldError.feeAmount}
                onChange={handleEmploymentChange}
                fullWidth
              />
              {requiredFieldError.feeAmount && <FormHelperText error>Fee amount is required</FormHelperText>}
            </FormControl>
          </Box>
          <FormControl fullWidth>
            <TextField
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
              value={employmentFields.comments}
              slotProps={{ inputLabel: { shrink: true } }}
              onChange={handleEmploymentChange}
              fullWidth
            />
          </FormControl>
          {error && <Alert severity="error">{error}</Alert>}

          <Box display="flex" flexDirection="row" gap={2} alignSelf="flex-end">
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