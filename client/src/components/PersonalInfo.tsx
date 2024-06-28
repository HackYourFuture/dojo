/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { ReactNode, useEffect, useState } from "react";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  TextField,
  Select,
  SelectChangeEvent,
  Stack,
  Box,
} from "@mui/material";
import {
  PersonalInfoProps,
  TraineePersonalInfo,
  Gender,
  EnglishLevel,
  Background,
  ResidencyStatus,
  EducationLevel,
} from "../types";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { LoadingButton } from "@mui/lab";

const NoIcon = () => null;

/**
 * Component for displaying trainee profile data on the personal information tab.
 *
 * @param {TraineePersonalInfo} traineeData trainee personal information.
 * @param {TraineePersonalInfo} saveTraineeData callback to save edited trainee personal information.
 * @returns {ReactNode} A React element that renders trainee personal information with view, add, and edit logic.
 */
export const PersonalInfo = ({
  traineeData,
  saveTraineeData,
}: PersonalInfoProps) => {
  useEffect(() => {
    if (traineeData) setEditedFields(traineeData as TraineePersonalInfo);
  }, [traineeData]);

  const [editedFields, setEditedFields] = useState<TraineePersonalInfo>(
    traineeData!
  );
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  /**
   * Function to enable edit mode when edit button is clicked.
   */
  const handleEditClick = () => {
    setIsEditing(true);
  };

  /**
   * Function to set editing mode to `false` when cancel button is clicked.
   */
  const handleCancelClick = () => {
    if (traineeData) {
      setEditedFields(traineeData);
    }
    setIsEditing(false);
  };

  /**
   * Function to handel the saving logic after clicking the save button.
   */
  const handleSaveClick = async () => {
    if (!editedFields || !traineeData) return;

    const changedFields: Partial<TraineePersonalInfo> = {};
    Object.entries(editedFields).forEach(([key, value]) => {
      if (traineeData[key as keyof TraineePersonalInfo] !== value) {
        changedFields[key as keyof TraineePersonalInfo] = value;
      }
    });

    const editedData: any = {
      personalInfo: {
        ...changedFields,
      },
    };

    setIsSaving(true);

    try {
      await saveTraineeData(editedData);
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving trainee data:", error);
    } finally {
      setIsSaving(false);
    }
  };

  /**
   * Function to handel changing text fields with edited data.
   * 
   * @param {HTMLInputElement} e the event received from the text fields after editing.
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedFields((prevFields) => ({
      ...prevFields,
      [name]: value,
    }));
  };

  /**
   * Function to handel changing select fields with edited data.
   * 
   * @param {SelectChangeEvent} event the event received from select component change.
   */
  const handleSelectChange = (
    event: SelectChangeEvent<
      string | boolean | { name?: string; value: ReactNode }
    >
  ) => {
    const { name, value } = event.target;
    setEditedFields((prevFields) => ({
      ...prevFields,
      [name]: value === "true" ? true : value === "false" ? false : value,
    }));
  };

  return (
    <Box
      display="flex"
      flexDirection="row"
      flexWrap="wrap"
      gap={4}
      padding="24px"
    >
      <Box width={"100%"} display="flex" justifyContent={"end"}>
        <Stack direction="row" spacing={2}>
          <LoadingButton
            color="primary"
            onClick={isEditing ? handleSaveClick : handleEditClick}
            loading={isSaving}
            variant="contained"
          >
            <span>{isEditing ? "Save" : "Edit profile"}</span>
          </LoadingButton>
          {isEditing && <Button onClick={handleCancelClick}>Cancel</Button>}
        </Stack>
      </Box>

      <div style={{ width: "100%" }}>
        {/* First Name */}
        <FormControl sx={{ mx: 2, my: 1, width: "25ch", gap: "2rem" }}>
          <TextField
            id="firstName"
            name="firstName"
            label="First Name"
            type="text"
            value={editedFields?.firstName || ""}
            InputProps={{ readOnly: isEditing ? false : true }}
            InputLabelProps={{ shrink: true }}
            variant={isEditing ? "outlined" : "standard"}
            onChange={handleChange}
          />
        </FormControl>

        {/* Last Name */}
        <FormControl sx={{ mx: 2, my: 1, width: "25ch", gap: "2rem" }}>
          <TextField
            id="lastName"
            name="lastName"
            label="Last Name"
            type="text"
            value={editedFields?.lastName || ""}
            InputProps={{ readOnly: isEditing ? false : true }}
            InputLabelProps={{ shrink: true }}
            variant={isEditing ? "outlined" : "standard"}
            onChange={handleChange}
          />
        </FormControl>

        {/* Preferred Name */}
        <FormControl sx={{ mx: 2, my: 1, width: "25ch", gap: "2rem" }}>
          <TextField
            id="preferredName"
            name="preferredName"
            label="Preferred Name"
            type="text"
            value={editedFields?.preferredName || ""}
            InputProps={{ readOnly: isEditing ? false : true }}
            InputLabelProps={{ shrink: true }}
            variant={isEditing ? "outlined" : "standard"}
            onChange={handleChange}
          />
        </FormControl>
      </div>

      <div style={{ width: "100%" }}>
        {/* Gender */}
        <FormControl
          variant={isEditing ? "outlined" : "standard"}
          sx={{ mx: 2, my: 1, width: "25ch", gap: "2rem" }}
        >
          <InputLabel htmlFor="gender">Gender</InputLabel>
          <Select
            name="gender"
            id="gender"
            label="Gender"
            value={editedFields?.gender || ""}
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
        <FormControl
          variant={isEditing ? "outlined" : "standard"}
          sx={{ mx: 2, my: 1, width: "25ch", gap: "2rem" }}
        >
          <InputLabel htmlFor="pronouns">Pronouns</InputLabel>
          <Select
            name="pronouns"
            id="pronouns"
            label="Pronouns"
            value={editedFields?.pronouns || ""}
            inputProps={{ readOnly: isEditing ? false : true }}
            IconComponent={isEditing ? ArrowDropDownIcon : NoIcon}
            startAdornment=" "
            onChange={handleSelectChange}
          >
            <MenuItem value="He/Him">He/Him</MenuItem>
            <MenuItem value="She/Her">She/Her</MenuItem>
            <MenuItem value="They/Them">They/Them</MenuItem>
          </Select>
        </FormControl>
      </div>

      <div style={{ width: "100%" }}>
        {/* Location */}
        <FormControl sx={{ mx: 2, my: 1, width: "25ch", gap: "2rem" }}>
          <TextField
            id="location"
            name="location"
            label="Location"
            type="text"
            value={editedFields?.location || ""}
            InputProps={{ readOnly: isEditing ? false : true }}
            InputLabelProps={{ shrink: true }}
            variant={isEditing ? "outlined" : "standard"}
            onChange={handleChange}
          />
        </FormControl>

        {/* Country of Origin */}
        <FormControl sx={{ mx: 2, my: 1, width: "25ch", gap: "2rem" }}>
          <TextField
            id="countryOfOrigin"
            name="countryOfOrigin"
            label="Country of Origin"
            type="text"
            value={editedFields?.countryOfOrigin || ""}
            InputProps={{ readOnly: isEditing ? false : true }}
            InputLabelProps={{ shrink: true }}
            variant={isEditing ? "outlined" : "standard"}
            onChange={handleChange}
          />
        </FormControl>

        {/* Background */}
        <FormControl
          variant={isEditing ? "outlined" : "standard"}
          sx={{ mx: 2, my: 1, width: "25ch", gap: "2rem" }}
        >
          <InputLabel htmlFor="background">Background</InputLabel>
          <Select
            name="background"
            id="background"
            label="Background"
            value={editedFields?.background || ""}
            inputProps={{ readOnly: isEditing ? false : true }}
            IconComponent={isEditing ? ArrowDropDownIcon : NoIcon}
            startAdornment=" "
            onChange={handleSelectChange}
          >
            <MenuItem value={Background.EUCitizen}>EU citizen</MenuItem>
            <MenuItem value={Background.FamilyReunification}>
              Family reunification
            </MenuItem>
            <MenuItem value={Background.PartnerOfSkilledMigrant}>
              Partner of a skilled migrant
            </MenuItem>
            <MenuItem value={Background.Refugee}>Refugee</MenuItem>
            <MenuItem value={Background.VulnerableGroup}>
              Vulnerable group
            </MenuItem>
          </Select>
        </FormControl>
      </div>

      <div style={{ width: "100%" }}>
        {/* Work Permit */}
        <FormControl
          variant={isEditing ? "outlined" : "standard"}
          sx={{ mx: 2, my: 1, width: "16ch", gap: "2rem" }}
        >
          <InputLabel htmlFor="hasWorkPermit">Work Permit</InputLabel>
          <Select
            name="hasWorkPermit"
            id="hasWorkPermit"
            label="Work Permit"
            value={
              editedFields?.hasWorkPermit == null
                ? ""
                : editedFields?.hasWorkPermit
            }
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
        <FormControl
          variant={isEditing ? "outlined" : "standard"}
          sx={{ mx: 2, my: 1, width: "24ch", gap: "2rem" }}
        >
          <InputLabel htmlFor="residencyStatus">Residency Status</InputLabel>
          <Select
            name="residencyStatus"
            id="residencyStatus"
            label="Residency Status"
            value={editedFields?.residencyStatus || ""}
            inputProps={{ readOnly: isEditing ? false : true }}
            IconComponent={isEditing ? ArrowDropDownIcon : NoIcon}
            startAdornment=" "
            onChange={handleSelectChange}
          >
            <MenuItem value={ResidencyStatus.FirstInterview}>
              First interview
            </MenuItem>
            <MenuItem value={ResidencyStatus.SecondInterview}>
              Second interview
            </MenuItem>
            <MenuItem value={ResidencyStatus.Residency}>Residency</MenuItem>
            <MenuItem value={ResidencyStatus.Citizenship}>Citizenship</MenuItem>
          </Select>
        </FormControl>

        {/* Social Benefits */}
        <FormControl
          variant={isEditing ? "outlined" : "standard"}
          sx={{ mx: 2, my: 1, width: "16ch", gap: "2rem" }}
        >
          <InputLabel htmlFor="receivesSocialBenefits">
            Social Benefits
          </InputLabel>
          <Select
            name="receivesSocialBenefits"
            id="receivesSocialBenefits"
            label="Social Benefits"
            value={
              editedFields?.receivesSocialBenefits == null
                ? ""
                : editedFields?.receivesSocialBenefits
            }
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
        <FormControl
          variant={isEditing ? "outlined" : "standard"}
          sx={{ mx: 2, my: 1, width: "16ch", gap: "2rem" }}
        >
          <InputLabel htmlFor="caseManagerUrging">
            Case Manager Urging
          </InputLabel>
          <Select
            name="caseManagerUrging"
            id="caseManagerUrging"
            label="Case Manager Urging"
            value={
              editedFields?.caseManagerUrging == null
                ? ""
                : editedFields?.caseManagerUrging
            }
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

      <div style={{ width: "100%" }}>
        {/* English Level */}
        <FormControl
          variant={isEditing ? "outlined" : "standard"}
          sx={{ mx: 2, my: 1, width: "25ch", gap: "2rem" }}
        >
          <InputLabel htmlFor="englishLevel">English Level</InputLabel>
          <Select
            name="englishLevel"
            id="englishLevel"
            label="English Level"
            value={editedFields?.englishLevel || ""}
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
        <FormControl
          variant={isEditing ? "outlined" : "standard"}
          sx={{ mx: 2, my: 1, width: "25ch", gap: "2rem" }}
        >
          <InputLabel htmlFor="professionalDutch">
            Professional Dutch
          </InputLabel>
          <Select
            name="professionalDutch"
            id="professionalDutch"
            label="Professional Dutch"
            value={
              editedFields?.professionalDutch == null
                ? ""
                : editedFields?.professionalDutch
            }
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

      <div style={{ width: "100%" }}>
        {/* Education Level */}
        <FormControl
          variant={isEditing ? "outlined" : "standard"}
          sx={{ mx: 2, my: 1, width: "25ch", gap: "2rem" }}
        >
          <InputLabel htmlFor="educationLevel">Education Level</InputLabel>
          <Select
            name="educationLevel"
            id="educationLevel"
            label="Education Level"
            value={editedFields?.educationLevel || ""}
            inputProps={{ readOnly: isEditing ? false : true }}
            IconComponent={isEditing ? ArrowDropDownIcon : NoIcon}
            startAdornment=" "
            onChange={handleSelectChange}
          >
            <MenuItem value={EducationLevel.None}>None</MenuItem>
            <MenuItem value={EducationLevel.HighSchool}>High school</MenuItem>
            <MenuItem value={EducationLevel.Diploma}>Diploma</MenuItem>
            <MenuItem value={EducationLevel.BachelorsDegree}>
              Bachelors degree
            </MenuItem>
            <MenuItem value={EducationLevel.MastersDegree}>
              Masters degree
            </MenuItem>
          </Select>
        </FormControl>

        {/* Education Background */}
        <FormControl sx={{ mx: 2, my: 1, width: "53ch", gap: "2rem" }}>
          <TextField
            id="educationBackground"
            name="educationBackground"
            label="Education Background"
            type="text"
            value={editedFields?.educationBackground || ""}
            InputProps={{ readOnly: isEditing ? false : true }}
            InputLabelProps={{ shrink: true }}
            variant={isEditing ? "outlined" : "standard"}
            onChange={handleChange}
          />
        </FormControl>
      </div>

      <div style={{ width: "100%" }}>
        {/* Comments */}
        <FormControl sx={{ mx: 2, width: "81ch" }}>
          <TextField
            id="comments"
            name="comments"
            label="Comments"
            type="text"
            multiline
            value={editedFields?.comments || ""}
            InputProps={{ readOnly: isEditing ? false : true }}
            InputLabelProps={{ shrink: true }}
            variant={isEditing ? "outlined" : "standard"}
            onChange={handleChange}
          />
        </FormControl>
      </div>
    </Box>
  );
};
