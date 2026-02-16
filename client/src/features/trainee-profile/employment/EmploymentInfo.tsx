import {
  Box,
  FormControl,
  InputAdornment,
  InputLabel,
  Link,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import { createSelectChangeHandler, createTextChangeHandler } from '../utils/formHelper';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { JobPath } from '../../../data/types/Trainee';
import LinkIcon from '@mui/icons-material/Link';
import { useTraineeProfileContext } from '../context/useTraineeProfileContext';
import { EmploymentHistoryGroup } from './history/EmploymentHistoryGroup';

const NoIcon = () => null;

/**
 * Component for displaying trainee profile data on the employment information tab.
 *
 * @returns {ReactNode} A React element that renders trainee employment information with view, add, and edit logic.
 */
export const EmploymentInfo = () => {
  const { trainee, setTrainee, isEditMode: isEditing } = useTraineeProfileContext();
  const { employmentInfo: editedFields } = trainee;

  const handleTextChange = createTextChangeHandler(setTrainee, 'employmentInfo');
  const handleSelectChange = createSelectChangeHandler(setTrainee, 'employmentInfo');


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
            slotProps={{ input: { readOnly: !isEditing } }}
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
            slotProps={{ input: { readOnly: !isEditing }, inputLabel: { shrink: true } }}
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
            slotProps={{ input: { readOnly: !isEditing }, inputLabel: { shrink: true } }}
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
            slotProps={{ input: { readOnly: !isEditing }, inputLabel: { shrink: true } }}
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
            slotProps={{ input: { readOnly: !isEditing } }}
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
            slotProps={{ input: { readOnly: !isEditing }, inputLabel: { shrink: true } }}
            variant={isEditing ? 'outlined' : 'standard'}
            onChange={handleTextChange}
          />
        </FormControl>
      </div>

      {/* Employment history */}
      <EmploymentHistoryGroup />

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
            slotProps={{ input: { readOnly: !isEditing }, inputLabel: { shrink: true } }}
            variant={isEditing ? 'outlined' : 'standard'}
            onChange={handleTextChange}
          />
        </FormControl>
      </div>
    </Box>
  );
};

export default EmploymentInfo;
