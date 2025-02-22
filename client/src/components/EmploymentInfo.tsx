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
  TextField,
  Typography,
} from '@mui/material';
import { useHandleSelectChange, useHandleTextChange } from '../helpers/helpers';

import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { JobPath } from '../models';
import LinkIcon from '@mui/icons-material/Link';
import React from 'react';
import { formatDate } from '../helpers/dateHelper';
import { useTraineeProfileContext } from '../hooks/traineeProfileContext';

const NoIcon = () => null;

/**
 * Component for displaying trainee profile data on the employment information tab.
 *
 * @returns {ReactNode} A React element that renders trainee employment information with view, add, and edit logic.
 */
export const EmploymentInfo = () => {
  const { trainee, setTrainee, isEditMode: isEditing } = useTraineeProfileContext();
  const { employmentInfo: editedFields } = trainee;
  const handleTextChange = useHandleTextChange(setTrainee, 'employmentInfo');
  const handleSelectChange = useHandleSelectChange(setTrainee, 'employmentInfo');

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
            inputProps={{ readOnly: isEditing ? false : true }}
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
            value={editedFields?.cvURL || ''}
            InputProps={{
              readOnly: isEditing ? false : true,
              endAdornment: (
                <InputAdornment position="start">
                  {!isEditing && editedFields?.cvURL && (
                    <Link href={editedFields?.cvURL} target="_blank">
                      <LinkIcon sx={{ color: 'action.active' }} />
                    </Link>
                  )}
                </InputAdornment>
              ),
            }}
            InputLabelProps={{
              shrink: true,
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
          <Typography variant="h6" color="black" padding="16px">
            Employment history ({editedFields?.employmentHistory.length || 0})
          </Typography>
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
};
