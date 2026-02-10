import {
  Box,
  Button,
  Divider,
  FormControl,
  InputAdornment,
  InputLabel,
  Link,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { createSelectChangeHandler, createTextChangeHandler } from '../utils/formHelper';

import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { EmploymentHistory, JobPath, Strike } from '../../../data/types/Trainee';
import LinkIcon from '@mui/icons-material/Link';
import React, { useState } from 'react';
import { formatDate } from '../utils/dateHelper';
import { useTraineeProfileContext } from '../context/useTraineeProfileContext';
import AddIcon from '@mui/icons-material/Add';
import { EmploymentDetailsModal } from './EmploymentDetailsModal.tsx';
import { useQueryClient } from '@tanstack/react-query';

const NoIcon = () => null;

/**
 * Component for displaying trainee profile data on the employment information tab.
 *
 * @returns {ReactNode} A React element that renders trainee employment information with view, add, and edit logic.
 */
export const EmploymentInfo = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const [modalError, setModalError] = useState<string>('');
  const [employmentToEdit, setEmploymentToEdit] = useState<EmploymentHistory | null>(null);
  const { traineeId, trainee, setTrainee, isEditMode: isEditing } = useTraineeProfileContext();
  const { employmentInfo: editedFields } = trainee;
  const { mutate: addEmployment, isPending: addEmploymentLoading } = useAddEmployment(traineeId);
  const { mutate: deleteEmployment, isPending: deleteEmploymentLoading, error: deleteEmploymentError } = useDeleteEmployment(traineeId);
  const { mutate: editEmployment, isPending: editEmploymentLoading } = useEditEmployment(traineeId);
  const { data: employments, isPending: employmentsLoading, error: employmentsError } = useGetEmployment(traineeId);
  const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] = useState(false);

  const handleTextChange = createTextChangeHandler(setTrainee, 'employmentInfo');
  const handleSelectChange = createSelectChangeHandler(setTrainee, 'employmentInfo');

  const [idToDelete, setIdToDelete] = useState<string>('');
  const queryClient = useQueryClient();
  const handleSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['employmentHistory', traineeId] });
    setIsModalOpen(false);
  };

  const getErrorMessage = (error: Error | unknown) => {
    return (error as Error).message || 'Unknown error';
  };

  const onClickEdit = (id: string) => {
    const employment = employments?.find((employment: EmploymentHistory) => employment.id === id) || null;

    setEmploymentToEdit(employment);
    setIsModalOpen(true);
  };

  const onConfirmAdd = async (strike: Strike) => {
    if (modalError) setModalError('');
    addStrike(strike, {
      onSuccess: handleSuccess,
      onError: (e) => {
        setModalError((e as Error).message);
      },
    });
  };

  const onConfirmEdit = (strike: Strike) => {
    if (modalError) setModalError('');
    editStrike(strike, {
      onSuccess: handleSuccess,
      onError: (e) => {
        setModalError((e as Error).message);
      },
    });
  };

  const onClickDelete = (id: string) => {
    setIdToDelete(id);
    setIsConfirmationDialogOpen(true);
  };

  /**
   * Function to enable adding entries.
   */
  const onClickAdd = () => {
    setEmploymentToEdit(null);
    setIsModalOpen(true);
  };

  /**
   * Function to cancel adding strikes.
   */
  const closeModal = () => {
    setIsModalOpen(false);
    setStrikeToEdit(null);
    setModalError('');
  };

  const onCancelDelete = () => {
    setIsConfirmationDialogOpen(false);
  };

  const onConfirmDelete = () => {
    deleteStrike(idToDelete, {
      onSuccess: () => {
        setIsConfirmationDialogOpen(false);
        queryClient.invalidateQueries({ queryKey: ['strikes', traineeId] });
      },
    });
  };

  return (
    <Box display="flex" flexDirection="row" flexWrap="wrap" gap={4} padding="24px">
      <div style={{ width: '100%' }}>
        {/* Job path */}
        <FormControl variant={isEditing ? 'outlined' : 'standard'} sx={{ mx: 2, my: 1, width: '20ch', gap: '2rem' }}>
          <InputLabel htmlFor="jobPath">Job path</InputLabel>
          <Select
            name="jobPath"
            id="jobPath"
            label="Job path"
            value={editedFields?.jobPath || ''}
            slotProps={{ input: { readOnly: isEditing } }}
            IconComponent={isEditing ? ArrowDropDownIcon : NoIcon}
            startAdornment=" "
            onChange={handleSelectChange}
          >
            <MenuItem value={JobPath.NotGraduated}>Not graduated</MenuItem>
            <MenuItem value={JobPath.Searching}>Searching</MenuItem>
            <MenuItem value={JobPath.Internship}>Internship</MenuItem>
            <MenuItem value={JobPath.TechJob}>Tech job</MenuItem>
            <MenuItem value={JobPath.NonTechJob}>Non-tech job</MenuItem>
            <MenuItem value={JobPath.NotSearching}>Not searching</MenuItem>
            <MenuItem value={JobPath.OtherStudies}>Other studies</MenuItem>
            <MenuItem value={JobPath.NoLongerHelping}>No longer helping</MenuItem>
          </Select>
        </FormControl>

        {/* CV */}
        <FormControl sx={{ mx: 2, my: 1, width: '30ch', gap: '2rem' }}>
          <TextField
            id="cvURL"
            name="cvURL"
            label="CV"
            type="url"
            placeholder="https://cv.example.com"
            value={editedFields?.cvURL || ''}
            // TODO: get back to this when get response from Stas
            slotProps={{
              input: {
                readOnly: !isEditing,
                endAdornment: (
                  <InputAdornment position="start">
                    {!isEditing && editedFields?.cvURL && (
                      <Link href={editedFields?.cvURL} target="_blank">
                        <LinkIcon sx={{ color: 'action.active' }} />
                      </Link>
                    )}
                  </InputAdornment>
                ),
              },
              inputLabel: { shrink: true },
            }}
            variant={isEditing ? 'outlined' : 'standard'}
            onChange={handleTextChange}
          />
        </FormControl>
      </div>

      <div style={{ width: '100%' }}>
        {/* Availability */}
        <FormControl sx={{ mx: 2, width: '30ch' }}>
          <TextField
            id="availability"
            name="availability"
            label="Availability"
            type="text"
            placeholder="From next month, fulltime"
            value={editedFields?.availability || ''}
            InputProps={{ readOnly: isEditing ? false : true }}
            InputLabelProps={{ shrink: true }}
            variant={isEditing ? 'outlined' : 'standard'}
            onChange={handleTextChange}
          />
        </FormControl>
      </div>

      <div style={{ width: '100%' }}>
        {/* Preferred role */}
        <FormControl sx={{ mx: 2, width: '30ch' }}>
          <TextField
            id="preferredRole"
            name="preferredRole"
            label="Preferred role"
            type="text"
            placeholder="Backend"
            value={editedFields?.preferredRole || ''}
            InputProps={{ readOnly: isEditing ? false : true }}
            InputLabelProps={{ shrink: true }}
            variant={isEditing ? 'outlined' : 'standard'}
            onChange={handleTextChange}
          />
        </FormControl>

        {/* Preferred location */}
        <FormControl sx={{ mx: 2, width: '30ch' }}>
          <TextField
            id="preferredLocation"
            name="preferredLocation"
            label="Preferred location"
            type="text"
            placeholder="Randstad, Utrecht"
            value={editedFields?.preferredLocation || ''}
            InputProps={{ readOnly: isEditing ? false : true }}
            InputLabelProps={{ shrink: true }}
            variant={isEditing ? 'outlined' : 'standard'}
            onChange={handleTextChange}
          />
        </FormControl>

        {/* Driving license */}
        <FormControl variant={isEditing ? 'outlined' : 'standard'} sx={{ mx: 2, width: '14ch' }}>
          <InputLabel htmlFor="drivingLicense">Driving license</InputLabel>
          <Select
            name="drivingLicense"
            id="drivingLicense"
            label="Driving license"
            value={editedFields?.drivingLicense == null ? '' : editedFields?.drivingLicense}
            inputProps={{ readOnly: isEditing ? false : true }}
            IconComponent={isEditing ? ArrowDropDownIcon : NoIcon}
            startAdornment=" "
            onChange={handleSelectChange}
          >
            <MenuItem value="true">Yes</MenuItem>
            <MenuItem value="false">No</MenuItem>
          </Select>
        </FormControl>
      </div>

      <div style={{ width: '100%' }}>
        {/* Extra technologies */}
        <FormControl sx={{ mx: 2, width: '30ch' }}>
          <TextField
            id="extraTechnologies"
            name="extraTechnologies"
            label="Extra technologies"
            type="text"
            placeholder="C#, C++, Vue.js"
            value={editedFields?.extraTechnologies || ''}
            InputProps={{ readOnly: isEditing ? false : true }}
            InputLabelProps={{ shrink: true }}
            variant={isEditing ? 'outlined' : 'standard'}
            onChange={handleTextChange}
          />
        </FormControl>
      </div>

      <div style={{ width: '100%' }}>
        {/* Employment history */}
        <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between">
          <Typography variant="h6" padding="16px">
            Employment history ({editedFields?.employmentHistory.length || 0})
          </Typography>
          <Stack direction="row" spacing={2}>
            <Button startIcon={<AddIcon />} onClick={onClickAdd}>
              New entry
            </Button>
          </Stack>
        </Box>

        <List
          sx={{
            width: '100%',
            bgcolor: 'background.paper',
          }}
        >
          {editedFields?.employmentHistory.map((employmentHistory, index) => (
            <React.Fragment key={employmentHistory.id}>
              <ListItem
                alignItems="flex-start"
                secondaryAction={formatDate(employmentHistory.startDate)}
                disablePadding
                sx={{
                  paddingBottom: '16px',
                }}
              >
                <ListItemText
                  primary={`${employmentHistory.role} at ${employmentHistory.companyName} (${employmentHistory.type})`}
                  secondary={employmentHistory.comments}
                />
              </ListItem>
              {index < editedFields?.employmentHistory.length - 1 && <Divider sx={{ color: 'black' }} component="li" />}
            </React.Fragment>
          ))}
        </List>
        <EmploymentDetailsModal
          isOpen={isModalOpen}
          error={modalError}
          isLoading={addEmploymentLoading || editEmploymentLoading}
          onClose={closeModal}
          onConfirmAdd={onConfirmAdd}
          onConfirmEdit={onConfirmEdit}
          initialEmployment={employmentToEdit}
        />
      </div>

      <div style={{ width: '100%' }}>
        {/* Comments */}
        <FormControl sx={{ mx: 2, width: '81ch' }}>
          <TextField
            id="comments"
            name="comments"
            label="Comments"
            type="text"
            multiline
            value={editedFields?.comments || ''}
            InputProps={{ readOnly: isEditing ? false : true }}
            InputLabelProps={{ shrink: true }}
            variant={isEditing ? 'outlined' : 'standard'}
            onChange={handleTextChange}
          />
        </FormControl>
      </div>
    </Box>
  );
};;;

export default EmploymentInfo;
