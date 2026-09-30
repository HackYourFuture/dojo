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
  Typography,
} from '@mui/material';
import { Interaction, InteractionType } from '../Interaction';

import FormDateTimeField from './FormDateTimeField';
import FormSelect from './FormSelect';
import FormTextField from './FormTextField';
import dayjs from 'dayjs';
import { useState } from 'react';

type InteractionDetailsModalProps = {
  isOpen: boolean;
  isLoading: boolean;
  error?: string;
  onClose: () => void;
  onConfirmAdd: (t: Interaction) => void;
  onConfirmEdit: (t: Interaction) => void;
  initialInteraction: Interaction | null;
  // The types to pick from, which differ per profile.
  types: InteractionType[];
};

export const InteractionDetailsModal = ({
  isOpen,
  isLoading,
  error,
  onClose,
  onConfirmAdd,
  onConfirmEdit,
  initialInteraction,
  types,
}: InteractionDetailsModalProps) => {
  const [interactionFields, setInteractionFields] = useState<Partial<Interaction>>({
    id: initialInteraction?.id || '',
    // Now, without the seconds the picker does not show.
    date: initialInteraction?.date || dayjs().startOf('minute').toDate(),
    type: initialInteraction?.type || undefined,
    title: initialInteraction?.title || '',
    details: initialInteraction?.details || '',
    reporter: initialInteraction?.reporter || undefined,
  });

  const [typeError, setTypeError] = useState(false);
  const [dateError, setDateError] = useState(false);
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
      [field]: value,
    }));
  };

  const handleDateChange = (date: Date | null) => {
    setDateError(false);
    setInteractionFields((prev) => ({
      ...prev,
      date: date ?? undefined,
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
    if (!interactionFields.date) {
      setDateError(true);
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
            {/* Keeps the error under the type, not between the type and the date. */}
            <Box width="100%">
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
            </Box>
            <FormControl fullWidth>
              <FormDateTimeField
                disabled={isLoading}
                label="Interaction Date"
                value={interactionFields.date}
                onChange={handleDateChange}
                error={dateError}
                required
              />
              {dateError && <FormHelperText error>Date is required</FormHelperText>}
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
            <Button loading={isLoading} disabled={isLoading} variant="contained" onClick={onConfirm}>
              {isEditMode ? 'Save' : 'Add'}
            </Button>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};
