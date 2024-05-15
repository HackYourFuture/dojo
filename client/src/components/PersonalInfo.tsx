/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { ReactNode, useEffect, useState } from "react";
import Box from "@mui/material/Box";

import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  TextField,
  Select,
  SelectChangeEvent,
  Stack,
} from "@mui/material";
import { TraineeData } from "../types";
import LoadingButton from "@mui/lab/LoadingButton";

interface PersonalInfoProps {
  traineeData?: TraineeData;
  saveTraineeData: (editedData: TraineeData) => void;
}

export const PersonalInfo = ({
  traineeData,

  saveTraineeData,
}: PersonalInfoProps) => {
  useEffect(() => {
    if (traineeData) setEditedFields(traineeData as TraineeData);
  }, [traineeData]);

  const [editedFields, setEditedFields] = useState<TraineeData>(traineeData!);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    if (traineeData) {
      setEditedFields(traineeData);
    }
    setIsEditing(false);
  };

  const handleSaveClick = () => {
    const editedData: any = {
      personalInfo: {
        ...editedFields,
      },
    };
    setIsSaving(true);
    if (!editedFields || !traineeData) return;
    saveTraineeData(editedData);
    setIsEditing(false);
    setIsSaving(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedFields((prevFields) => ({
      ...prevFields,
      [name]: value,
    }));
  };

  const handleSelectChange = (
    event: SelectChangeEvent<
      string | boolean | { name?: string; value: ReactNode }
    >
  ) => {
    const { name, value } = event.target;
    setEditedFields((prevFields) => ({
      ...prevFields,
      [name]: value,
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
        {isEditing ? (
          <Stack direction="row" spacing={2}>
            <LoadingButton
              color="primary"
              onClick={handleSaveClick}
              loading={isSaving}
              variant="contained"
            >
              <span>Save</span>
            </LoadingButton>
            <Button onClick={handleCancelClick}>cancel</Button>
          </Stack>
        ) : (
          <Button variant="contained" onClick={handleEditClick}>
            Edit Profile
          </Button>
        )}
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
            startAdornment=" "
            onChange={handleSelectChange}
          >
            <MenuItem value="woman">Woman</MenuItem>
            <MenuItem value="man">Man</MenuItem>
            <MenuItem value="non-binary">Non-Binary</MenuItem>
            <MenuItem value="other">Other</MenuItem>
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
            startAdornment=" "
            onChange={handleSelectChange}
          >
            <MenuItem value="eu-citizen">EU citizen</MenuItem>
            <MenuItem value="family-reunification">
              Family reunification
            </MenuItem>
            <MenuItem value="partner-of-skilled-migrant">
              Partner of a skilled migrant
            </MenuItem>
            <MenuItem value="refugee">Refugee</MenuItem>
            <MenuItem value="vulnerable-group">Vulnerable group</MenuItem>
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
            startAdornment=" "
            onChange={handleSelectChange}
          >
            <MenuItem value="first-interview">First Interview</MenuItem>
            <MenuItem value="second-interview">Second Interview</MenuItem>
            <MenuItem value="residency">Residency</MenuItem>
            <MenuItem value="citizenship">Citizenship</MenuItem>
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
            startAdornment=" "
            onChange={handleSelectChange}
          >
            <MenuItem value="needs-work">Needs work</MenuItem>
            <MenuItem value="moderate">Moderate</MenuItem>
            <MenuItem value="good">Good</MenuItem>
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
            startAdornment=" "
            onChange={handleSelectChange}
          >
            <MenuItem value="none">None</MenuItem>
            <MenuItem value="high-school">High school</MenuItem>
            <MenuItem value="diploma">Diploma</MenuItem>
            <MenuItem value="bachelors-degree">Bachelors degree</MenuItem>
            <MenuItem value="masters-degree">Masters degree</MenuItem>
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
