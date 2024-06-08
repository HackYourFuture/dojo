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

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    if (traineeData) {
      setEditedFields(traineeData);
    }
    setIsEditing(false);
  };

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
            {Object.entries(Gender).map(([key, value]) => {
              const text = value
                .split("-")
                .map((word, index) =>
                  index === 0
                    ? word.charAt(0).toUpperCase() + word.slice(1)
                    : word
                )
                .join(" ");

              return (
                <MenuItem key={key} value={value}>
                  {text}
                </MenuItem>
              );
            })}
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
            {Object.entries(Background).map(([key, value]) => {
              const text = value
                .split("-")
                .map((word, index) =>
                  index === 0
                    ? word.charAt(0).toUpperCase() + word.slice(1)
                    : word
                )
                .join(" ");

              return (
                <MenuItem key={key} value={value}>
                  {text}
                </MenuItem>
              );
            })}
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
            {Object.entries(ResidencyStatus).map(([key, value]) => {
              const text = value
                .split("-")
                .map((word, index) =>
                  index === 0
                    ? word.charAt(0).toUpperCase() + word.slice(1)
                    : word
                )
                .join(" ");

              return (
                <MenuItem key={key} value={value}>
                  {text}
                </MenuItem>
              );
            })}
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
            {Object.entries(EnglishLevel).map(([key, value]) => {
              const text = value
                .split("-")
                .map((word, index) =>
                  index === 0
                    ? word.charAt(0).toUpperCase() + word.slice(1)
                    : word
                )
                .join(" ");

              return (
                <MenuItem key={key} value={value}>
                  {text}
                </MenuItem>
              );
            })}
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
            {Object.entries(EducationLevel).map(([key, value]) => {
              const text = value
                .split("-")
                .map((word, index) =>
                  index === 0
                    ? word.charAt(0).toUpperCase() + word.slice(1)
                    : word
                )
                .join(" ");

              return (
                <MenuItem key={key} value={value}>
                  {text}
                </MenuItem>
              );
            })}
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
