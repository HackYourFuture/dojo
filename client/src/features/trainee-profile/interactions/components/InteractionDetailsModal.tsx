import {
  Alert,
  Backdrop,
  Box,
  Button,
  Fade,
  FormControl,
  FormHelperText,
  Modal,
  SelectChangeEvent,
  TextField,
  Typography,
} from '@mui/material';
import { Interaction, InteractionType } from '../Interactions';

import FormSelect from './FormSelect';
import FormTextField from './FormTextField';
import { LoadingButton } from '@mui/lab';
import { formatDate } from '../../utils/dateHelper';
import { useState } from 'react';

const types = Object.values(InteractionType);

type InteractionDetailsModalProps = {
  isOpen: boolean;
  isLoading: boolean;
  error?: string;
  onClose: () => void;
  onConfirmAdd: (t: Interaction) => void;
  onConfirmEdit: (t: Interaction) => void;
  initialInteraction: Interaction | null;
};

export const InteractionDetailsModal = ({
  isOpen,
  isLoading,
  error,
  onClose,
  onConfirmAdd,
  onConfirmEdit,
  initialInteraction,
}: InteractionDetailsModalProps) => {
  const [interactionFields, setInteractionFields] = useState<Partial<Interaction>>({
    id: initialInteraction?.id || '',
    date: initialInteraction?.date || new Date(),
    type: initialInteraction?.type || undefined,
    title: initialInteraction?.title || '',
    details: initialInteraction?.details || '',
    reporter: initialInteraction?.reporter || undefined,
  });

  const [typeError, setTypeError] = useState(false);
  const [detailsError, setDetailsError] = useState(false);
  const [titleError, setTitleError] = useState(false);

  const isEditMode = Boolean(initialInteraction);

  const handleClose = () => {
    onClose();
  };

  const handleChange = (field: keyof Interaction) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (field === 'details') {
      setDetailsError(false);
    }
    if (field === 'title') {
      setTitleError(false);
    }

    setInteractionFields((prev) => ({
      ...prev,
      [field]: field === 'date' ? new Date(value) : value,
    }));
  };

  const handleTypeChange = (e: SelectChangeEvent<string>) => {
    setTypeError(false);
    setInteractionFields((prev) => ({
      ...prev,
      type: e.target.value as InteractionType,
    }));
  };

  const onConfirm = () => {
    let invalid = false;
    if (!interactionFields.type) {
      setTypeError(true);
      invalid = true;
    }
    if (!interactionFields.details) {
      setDetailsError(true);
      invalid = true;
    }
    if (!interactionFields.title) {
      setTitleError(true);
      invalid = true;
    }

    if (invalid) {
      return;
    }

    if (isEditMode) {
      onConfirmEdit(interactionFields as Interaction);
    } else {
      onConfirmAdd(interactionFields as Interaction);
    }
  };

  return (
    <Modal
      open={isOpen}
      onClose={handleClose}
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
            borderRadius: 1,
          }}
        >
          <Typography variant="h6" mb={0.5}>
            {isEditMode ? 'Edit an interaction' : 'Add a new interaction'}
          </Typography>

          <Box display="flex" sx={{ gap: 3 }} justifyContent="space-between">
            <FormSelect
              disabled={isLoading}
              id="interactionType"
              label="Type"
              value={interactionFields.type ?? ''}
              onChange={handleTypeChange}
              optionLabels={types}
              required
            />
            {typeError && <FormHelperText error>Type is required</FormHelperText>}
            <FormControl fullWidth>
              <TextField
                disabled={isLoading}
                id={interactionFields?.date ? 'date' : 'dateEmpty'}
                name="date"
                label="Test Date"
                type="date"
                value={formatDate(interactionFields.date)}
                InputLabelProps={{ shrink: true }}
                onChange={handleChange('date')}
              />
            </FormControl>
          </Box>
          <Box>
            <FormTextField
              disabled={isLoading}
              label="Title"
              placeholder="title"
              value={interactionFields.title || ''}
              onChange={handleChange('title')}
              width="100%"
              required
              error={titleError}
            />
            {titleError && <FormHelperText error>Title is required</FormHelperText>}
          </Box>

          <Box>
            <FormTextField
              disabled={isLoading}
              label="Comments"
              value={interactionFields.details || ''}
              onChange={handleChange('details')}
              multiline
              minRows={4}
              maxRows={10}
              required
              error={detailsError}
            />
            {detailsError && <FormHelperText error>Comments are required</FormHelperText>}
          </Box>

          {error && <Alert severity="error">{error}</Alert>}

          <Box display="flex" gap={2} justifyContent="flex-end">
            <Button variant="outlined" disabled={isLoading} onClick={handleClose}>
              Cancel
            </Button>
            <LoadingButton loading={isLoading} disabled={isLoading} variant="contained" onClick={onConfirm}>
              {isEditMode ? 'Save' : 'Add'}
            </LoadingButton>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};
