import { Background, EducationLevel, EnglishLevel, Gender, Pronouns, ResidencyStatus } from '../Trainee';
import { Box, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { createSelectChangeHandler, createTextChangeHandler } from '../utils/formHelper';

import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { useTraineeProfileContext } from '../context/useTraineeProfileContext';

const NoIcon = () => null;

/**
 * Component for displaying  and updating trainee profile data on the personal information tab.
 *
 * @returns {ReactNode} A React element that renders trainee personal information with view, add, and edit logic.
 */
const PersonalInfo = () => {
  const { trainee, setTrainee, isEditMode: isEditing } = useTraineeProfileContext();
  const { personalInfo: editedFields } = trainee;

  /**
   * Function to handel changing text fields with edited data.
   *
   * @param {HTMLInputElement} e the event received from the text fields after editing.
   */
  const handleChange = createTextChangeHandler(setTrainee, 'personalInfo');

  /**
   * Function to handel changing select fields with edited data.
   *
   * @param {SelectChangeEvent} event the event received from select component change.
   */
  const handleSelectChange = createSelectChangeHandler(setTrainee, 'personalInfo');

  return (
    <Box display="flex" flexDirection="row" flexWrap="wrap" gap={4} padding="24px">
      <div style={{ width: '100%' }}>
        {/* First Name */}
        <FormControl sx={{ mx: 2, my: 1, width: '25ch', gap: '2rem' }}>
          <TextField
            id="firstName"
            name="firstName"
            label="First name"
            type="text"
            value={editedFields?.firstName || ''}
            InputProps={{ readOnly: isEditing ? false : true }}
            InputLabelProps={{ shrink: true }}
            variant={isEditing ? 'outlined' : 'standard'}
            onChange={handleChange}
          />
        </FormControl>

        {/* Last Name */}
        <FormControl sx={{ mx: 2, my: 1, width: '25ch', gap: '2rem' }}>
          <TextField
            id="lastName"
            name="lastName"
            label="Last name"
            type="text"
            value={editedFields?.lastName || ''}
            InputProps={{ readOnly: isEditing ? false : true }}
            InputLabelProps={{ shrink: true }}
            variant={isEditing ? 'outlined' : 'standard'}
            onChange={handleChange}
          />
        </FormControl>

        {/* Preferred Name */}
        <FormControl sx={{ mx: 2, my: 1, width: '25ch', gap: '2rem' }}>
          <TextField
            id="preferredName"
            name="preferredName"
            label="Preferred name"
            type="text"
            value={editedFields?.preferredName || ''}
            InputProps={{ readOnly: isEditing ? false : true }}
            InputLabelProps={{ shrink: true }}
            variant={isEditing ? 'outlined' : 'standard'}
            onChange={handleChange}
          />
        </FormControl>
      </div>

      <div style={{ width: '100%' }}>
        {/* Gender */}
        <FormControl variant={isEditing ? 'outlined' : 'standard'} sx={{ mx: 2, my: 1, width: '25ch', gap: '2rem' }}>
          <InputLabel htmlFor="gender">Gender</InputLabel>
          <Select
            name="gender"
            id="gender"
            label="Gender"
            value={editedFields?.gender || ''}
            inputProps={{ readOnly: isEditing ? false : true }}
            IconComponent={isEditing ? ArrowDropDownIcon : NoIcon}
            startAdornment=" "
            onChange={handleSelectChange}
          >
            <MenuItem value={Gender.Woman}>Woman</MenuItem>
            <MenuItem value={Gender.Man}>Man</MenuItem>
            <MenuItem value={Gender.NonBinary}>Non binary</MenuItem>
            <MenuItem value={Gender.Other}>Other</MenuItem>
          </Select>
        </FormControl>

        {/* Pronouns */}
        <FormControl variant={isEditing ? 'outlined' : 'standard'} sx={{ mx: 2, my: 1, width: '25ch', gap: '2rem' }}>
          <InputLabel htmlFor="pronouns">Pronouns</InputLabel>
          <Select
            name="pronouns"
            id="pronouns"
            label="Pronouns"
            value={editedFields?.pronouns || ''}
            inputProps={{ readOnly: isEditing ? false : true }}
            IconComponent={isEditing ? ArrowDropDownIcon : NoIcon}
            startAdornment=" "
            onChange={handleSelectChange}
          >
            <MenuItem value={Pronouns.HeHim}>{Pronouns.HeHim}</MenuItem>
            <MenuItem value={Pronouns.SheHer}>{Pronouns.SheHer}</MenuItem>
            <MenuItem value={Pronouns.TheyThem}>{Pronouns.TheyThem}</MenuItem>
            <MenuItem value={Pronouns.HeThey}>{Pronouns.HeThey}</MenuItem>
            <MenuItem value={Pronouns.SheThey}>{Pronouns.SheThey}</MenuItem>
          </Select>
        </FormControl>
      </div>

      <div style={{ width: '100%' }}>
        {/* Location */}
        <FormControl sx={{ mx: 2, my: 1, width: '25ch', gap: '2rem' }}>
          <TextField
            id="location"
            name="location"
            label="Location"
            type="text"
            value={editedFields?.location || ''}
            InputProps={{ readOnly: isEditing ? false : true }}
            InputLabelProps={{ shrink: true }}
            variant={isEditing ? 'outlined' : 'standard'}
            onChange={handleChange}
          />
        </FormControl>

        {/* Country of Origin */}
        <FormControl sx={{ mx: 2, my: 1, width: '25ch', gap: '2rem' }}>
          <TextField
            id="countryOfOrigin"
            name="countryOfOrigin"
            label="Country of origin"
            type="text"
            value={editedFields?.countryOfOrigin || ''}
            InputProps={{ readOnly: isEditing ? false : true }}
            InputLabelProps={{ shrink: true }}
            variant={isEditing ? 'outlined' : 'standard'}
            onChange={handleChange}
          />
        </FormControl>

        {/* Background */}
        <FormControl variant={isEditing ? 'outlined' : 'standard'} sx={{ mx: 2, my: 1, width: '25ch', gap: '2rem' }}>
          <InputLabel htmlFor="background">Background</InputLabel>
          <Select
            name="background"
            id="background"
            label="Background"
            value={editedFields?.background || ''}
            inputProps={{ readOnly: isEditing ? false : true }}
            IconComponent={isEditing ? ArrowDropDownIcon : NoIcon}
            startAdornment=" "
            onChange={handleSelectChange}
          >
            <MenuItem value={Background.EUCitizen}>EU citizen</MenuItem>
            <MenuItem value={Background.FamilyReunification}>Family reunification</MenuItem>
            <MenuItem value={Background.PartnerOfSkilledMigrant}>Partner of a skilled migrant</MenuItem>
            <MenuItem value={Background.Refugee}>Refugee</MenuItem>
            <MenuItem value={Background.VulnerableGroup}>Vulnerable group</MenuItem>
          </Select>
        </FormControl>
      </div>

      <div style={{ width: '100%' }}>
        {/* Work Permit */}
        <FormControl variant={isEditing ? 'outlined' : 'standard'} sx={{ mx: 2, my: 1, width: '16ch', gap: '2rem' }}>
          <InputLabel htmlFor="hasWorkPermit">Work permit</InputLabel>
          <Select
            name="hasWorkPermit"
            id="hasWorkPermit"
            label="Work permit"
            value={editedFields?.hasWorkPermit == null ? '' : editedFields?.hasWorkPermit}
            inputProps={{ readOnly: isEditing ? false : true }}
            IconComponent={isEditing ? ArrowDropDownIcon : NoIcon}
            startAdornment=" "
            onChange={handleSelectChange}
          >
            <MenuItem value="true">Yes</MenuItem>
            <MenuItem value="false">No</MenuItem>
          </Select>
        </FormControl>

        {/* Residency Status */}
        <FormControl variant={isEditing ? 'outlined' : 'standard'} sx={{ mx: 2, my: 1, width: '24ch', gap: '2rem' }}>
          <InputLabel htmlFor="residencyStatus">Residency status</InputLabel>
          <Select
            name="residencyStatus"
            id="residencyStatus"
            label="Residency status"
            value={editedFields?.residencyStatus || ''}
            inputProps={{ readOnly: isEditing ? false : true }}
            IconComponent={isEditing ? ArrowDropDownIcon : NoIcon}
            startAdornment=" "
            onChange={handleSelectChange}
          >
            <MenuItem value={ResidencyStatus.FirstInterview}>First interview</MenuItem>
            <MenuItem value={ResidencyStatus.SecondInterview}>Second interview</MenuItem>
            <MenuItem value={ResidencyStatus.Residency}>Residency</MenuItem>
            <MenuItem value={ResidencyStatus.Citizenship}>Citizenship</MenuItem>
          </Select>
        </FormControl>

        {/* Social Benefits */}
        <FormControl variant={isEditing ? 'outlined' : 'standard'} sx={{ mx: 2, my: 1, width: '16ch', gap: '2rem' }}>
          <InputLabel htmlFor="receivesSocialBenefits">Uitkering</InputLabel>
          <Select
            name="receivesSocialBenefits"
            id="receivesSocialBenefits"
            label="Uitkering"
            value={editedFields?.receivesSocialBenefits == null ? '' : editedFields?.receivesSocialBenefits}
            inputProps={{ readOnly: isEditing ? false : true }}
            IconComponent={isEditing ? ArrowDropDownIcon : NoIcon}
            startAdornment=" "
            onChange={handleSelectChange}
          >
            <MenuItem value="true">Yes</MenuItem>
            <MenuItem value="false">No</MenuItem>
          </Select>
        </FormControl>

        {/* Case Manager Urging */}
        <FormControl variant={isEditing ? 'outlined' : 'standard'} sx={{ mx: 2, my: 1, width: '16ch', gap: '2rem' }}>
          <InputLabel htmlFor="caseManagerUrging">Case manager urging</InputLabel>
          <Select
            name="caseManagerUrging"
            id="caseManagerUrging"
            label="Case manager urging"
            value={editedFields?.caseManagerUrging == null ? '' : editedFields?.caseManagerUrging}
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
        {/* English Level */}
        <FormControl variant={isEditing ? 'outlined' : 'standard'} sx={{ mx: 2, my: 1, width: '25ch', gap: '2rem' }}>
          <InputLabel htmlFor="englishLevel">English level</InputLabel>
          <Select
            name="englishLevel"
            id="englishLevel"
            label="English level"
            value={editedFields?.englishLevel || ''}
            inputProps={{ readOnly: isEditing ? false : true }}
            IconComponent={isEditing ? ArrowDropDownIcon : NoIcon}
            startAdornment=" "
            onChange={handleSelectChange}
          >
            <MenuItem value={EnglishLevel.NeedsWork}>Needs work</MenuItem>
            <MenuItem value={EnglishLevel.Moderate}>Moderate</MenuItem>
            <MenuItem value={EnglishLevel.Good}>Good</MenuItem>
          </Select>
        </FormControl>

        {/* Professional Dutch */}
        <FormControl variant={isEditing ? 'outlined' : 'standard'} sx={{ mx: 2, my: 1, width: '25ch', gap: '2rem' }}>
          <InputLabel htmlFor="professionalDutch">Professional dutch</InputLabel>
          <Select
            name="professionalDutch"
            id="professionalDutch"
            label="Professional dutch"
            value={editedFields?.professionalDutch == null ? '' : editedFields?.professionalDutch}
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
        {/* Education Level */}
        <FormControl variant={isEditing ? 'outlined' : 'standard'} sx={{ mx: 2, my: 1, width: '25ch', gap: '2rem' }}>
          <InputLabel htmlFor="educationLevel">Education level</InputLabel>
          <Select
            name="educationLevel"
            id="educationLevel"
            label="Education level"
            value={editedFields?.educationLevel || ''}
            inputProps={{ readOnly: isEditing ? false : true }}
            IconComponent={isEditing ? ArrowDropDownIcon : NoIcon}
            startAdornment=" "
            onChange={handleSelectChange}
          >
            <MenuItem value={EducationLevel.None}>None</MenuItem>
            <MenuItem value={EducationLevel.HighSchool}>High school</MenuItem>
            <MenuItem value={EducationLevel.Diploma}>Diploma</MenuItem>
            <MenuItem value={EducationLevel.BachelorsDegree}>Bachelors degree</MenuItem>
            <MenuItem value={EducationLevel.MastersDegree}>Masters degree</MenuItem>
            <MenuItem value={EducationLevel.PhD}>PhD</MenuItem>
          </Select>
        </FormControl>

        {/* Education Background */}
        <FormControl sx={{ mx: 2, my: 1, width: '53ch', gap: '2rem' }}>
          <TextField
            id="educationBackground"
            name="educationBackground"
            label="Education background"
            type="text"
            value={editedFields?.educationBackground || ''}
            InputProps={{ readOnly: isEditing ? false : true }}
            InputLabelProps={{ shrink: true }}
            variant={isEditing ? 'outlined' : 'standard'}
            onChange={handleChange}
          />
        </FormControl>
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
            onChange={handleChange}
          />
        </FormControl>
      </div>
    </Box>
  );
};

export default PersonalInfo;
