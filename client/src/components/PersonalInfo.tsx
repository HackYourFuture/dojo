/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { ReactNode, useEffect, useState } from "react";

import Box from "@mui/material/Box";

import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { TraineeData } from "../types";

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

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    const editedData: any = {};
    if (!editedFields || !traineeData) return;
    Object.entries(editedFields).forEach(([key, value]) => {
      if (traineeData && traineeData[key as keyof TraineeData] !== value) {
        editedData[key as keyof any] = value;
      }
    });
    saveTraineeData(editedData);
    setIsEditing(false);
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
          <Button variant="contained" color="primary" onClick={handleSaveClick}>
            Save
          </Button>
        ) : (
          <Button variant="contained" onClick={handleEditClick}>
            Edit Profile
          </Button>
        )}
      </Box>
      <div style={{ width: "100%" }}>
        {/* First Name */}
        <FormControl sx={{ mx: 2, my: 1, width: "25ch", gap: "2rem" }}>
          <InputLabel sx={{ color: "black" }} htmlFor="firstName">
            First Name
          </InputLabel>
          <OutlinedInput
            id="firstName"
            name="firstName"
            label="First Name"
            value={editedFields?.firstName || ""}
            onChange={handleChange}
            disabled={!isEditing}
            startAdornment=" "
          />
        </FormControl>

        {/* Last Name */}
        <FormControl sx={{ mx: 2, my: 1, width: "25ch", gap: "2rem" }}>
          <InputLabel sx={{ color: "black" }} htmlFor="lastName">
            Last Name
          </InputLabel>
          <OutlinedInput
            id="lastName"
            name="lastName"
            label="Last Name"
            value={editedFields?.lastName || ""}
            onChange={handleChange}
            disabled={!isEditing}
            startAdornment=" "
          />
        </FormControl>

        {/* Preferred Name */}
        <FormControl sx={{ mx: 2, my: 1, width: "25ch", gap: "2rem" }}>
          <InputLabel sx={{ color: "black" }} htmlFor="preferredName">
            Preferred Name
          </InputLabel>
          <OutlinedInput
            id="preferredName"
            name="preferredName"
            label="Preferred Name"
            value={editedFields?.preferredName || ""}
            onChange={handleChange}
            disabled={!isEditing}
            startAdornment=" "
          />
        </FormControl>
      </div>

      <div style={{ width: "100%" }}>
        {/* Gender */}
        <FormControl sx={{ mx: 2, my: 1, width: "25ch", gap: "2rem" }}>
          <InputLabel sx={{ color: "black" }} htmlFor="gender">
            Gender
          </InputLabel>
          <Select
            name="gender"
            id="gender"
            label="Gender"
            value={editedFields?.gender || ""}
            onChange={handleSelectChange}
            disabled={!isEditing}
            startAdornment=" "
          >
            <MenuItem value="male">Male</MenuItem>
            <MenuItem value="female">Female</MenuItem>
            <MenuItem value="other">Other</MenuItem>
          </Select>
        </FormControl>

        {/* Pronouns */}
        <FormControl sx={{ mx: 2, my: 1, width: "25ch", gap: "2rem" }}>
          <InputLabel sx={{ color: "black" }} htmlFor="pronouns">
            Pronouns
          </InputLabel>
          <Select
            name="pronouns"
            id="pronouns"
            label="Pronouns"
            value={editedFields?.pronouns || ""}
            onChange={handleSelectChange}
            disabled={!isEditing}
            startAdornment=" "
          >
            <MenuItem value="he">He/His</MenuItem>
            <MenuItem value="she">She/Her</MenuItem>
            <MenuItem value="they">They/Their</MenuItem>
          </Select>
        </FormControl>
      </div>

      <div style={{ width: "100%" }}>
        {/* Location */}
        <FormControl sx={{ mx: 2, my: 1, width: "25ch", gap: "2rem" }}>
          <InputLabel sx={{ color: "black" }} htmlFor="location">
            Location
          </InputLabel>
          <OutlinedInput
            id="location"
            name="location"
            label="Location"
            value={editedFields?.location || ""}
            onChange={handleChange}
            disabled={!isEditing}
            startAdornment=" "
          />
        </FormControl>

        {/* Country of Origin */}
        <FormControl sx={{ mx: 2, my: 1, width: "25ch", gap: "2rem" }}>
          <InputLabel sx={{ color: "black" }} htmlFor="countryOfOrigin">
            Country of Origin
          </InputLabel>
          <OutlinedInput
            id="countryOfOrigin"
            name="countryOfOrigin"
            label="Country of Origin"
            value={editedFields?.countryOfOrigin || ""}
            onChange={handleChange}
            disabled={!isEditing}
            startAdornment=" "
          />
        </FormControl>

        {/* Background */}
        <FormControl sx={{ mx: 2, my: 1, width: "25ch", gap: "2rem" }}>
          <InputLabel sx={{ color: "black" }} htmlFor="background">
            Background
          </InputLabel>
          <Select
            name="background"
            id="background"
            label="Background"
            value={editedFields?.background || ""}
            onChange={handleSelectChange}
            disabled={!isEditing}
            startAdornment=" "
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
        <FormControl sx={{ mx: 2, my: 1, width: "16ch", gap: "2rem" }}>
          <InputLabel sx={{ color: "black" }} htmlFor="hasWorkPermit">
            Work Permit
          </InputLabel>
          <Select
            name="hasWorkPermit"
            id="hasWorkPermit"
            label="Work Permit"
            value={editedFields?.hasWorkPermit || ""}
            onChange={handleSelectChange}
            disabled={!isEditing}
            startAdornment=" "
          >
            <MenuItem value="yes">Yes</MenuItem>
            <MenuItem value="no">No</MenuItem>
          </Select>
        </FormControl>

        {/* Residency Status */}
        <FormControl sx={{ mx: 2, my: 1, width: "24ch", gap: "2rem" }}>
          <InputLabel sx={{ color: "black" }} htmlFor="residencyStatus">
            Residency Status
          </InputLabel>
          <Select
            name="residencyStatus"
            id="residencyStatus"
            label="Residency Status"
            value={editedFields?.residencyStatus || ""}
            onChange={handleSelectChange}
            disabled={!isEditing}
            startAdornment=" "
          >
            <MenuItem value="first-interview">First Interview</MenuItem>
            <MenuItem value="second-interview">Second Interview</MenuItem>
            <MenuItem value="residency">Residency</MenuItem>
            <MenuItem value="citizenship">Citizenship</MenuItem>
          </Select>
        </FormControl>

        {/* Social Benefits */}
        <FormControl sx={{ mx: 2, my: 1, width: "16ch", gap: "2rem" }}>
          <InputLabel sx={{ color: "black" }} htmlFor="receivesSocialBenefits">
            Social Benefits
          </InputLabel>
          <Select
            name="receivesSocialBenefits"
            id="receivesSocialBenefits"
            label="Social Benefits"
            value={editedFields?.receivesSocialBenefits || ""}
            onChange={handleSelectChange}
            disabled={!isEditing}
            startAdornment=" "
          >
            <MenuItem value="yes">Yes</MenuItem>
            <MenuItem value="no">No</MenuItem>
          </Select>
        </FormControl>

        {/* Case Manager Urging */}
        <FormControl sx={{ mx: 2, my: 1, width: "16ch", gap: "2rem" }}>
          <InputLabel sx={{ color: "black" }} htmlFor="caseManagerUrging">
            Case Manager Urging
          </InputLabel>
          <Select
            name="caseManagerUrging"
            id="caseManagerUrging"
            label="Case Manager Urging"
            value={editedFields?.caseManagerUrging || ""}
            onChange={handleSelectChange}
            disabled={!isEditing}
            startAdornment=" "
          >
            <MenuItem value="yes">Yes</MenuItem>
            <MenuItem value="no">No</MenuItem>
          </Select>
        </FormControl>
      </div>

      <div style={{ width: "100%" }}>
        {/* English Level */}
        <FormControl sx={{ mx: 2, my: 1, width: "25ch", gap: "2rem" }}>
          <InputLabel sx={{ color: "black" }} htmlFor="englishLevel">
            English Level
          </InputLabel>
          <Select
            name="englishLevel"
            id="englishLevel"
            label="English Level"
            value={editedFields?.englishLevel || ""}
            onChange={handleSelectChange}
            disabled={!isEditing}
            startAdornment=" "
          >
            <MenuItem value="needs-work">Needs work</MenuItem>
            <MenuItem value="moderate">Moderate</MenuItem>
            <MenuItem value="good">Good</MenuItem>
          </Select>
        </FormControl>

        {/* Professional Dutch */}
        <FormControl sx={{ mx: 2, my: 1, width: "25ch", gap: "2rem" }}>
          <InputLabel sx={{ color: "black" }} htmlFor="professionalDutch">
            Professional Dutch
          </InputLabel>
          <Select
            name="professionalDutch"
            id="professionalDutch"
            label="Professional Dutch"
            value={editedFields?.professionalDutch || ""}
            onChange={handleSelectChange}
            disabled={!isEditing}
            startAdornment=" "
          >
            <MenuItem value="yes">Yes</MenuItem>
            <MenuItem value="no">No</MenuItem>
          </Select>
        </FormControl>
      </div>

      <div style={{ width: "100%" }}>
        {/* Education Level */}
        <FormControl sx={{ mx: 2, my: 1, width: "25ch", gap: "2rem" }}>
          <InputLabel sx={{ color: "black" }} htmlFor="educationLevel">
            Education Level
          </InputLabel>
          <Select
            name="educationLevel"
            id="educationLevel"
            label="Education Level"
            value={editedFields?.educationLevel || ""}
            onChange={handleSelectChange}
            disabled={!isEditing}
            startAdornment=" "
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
          <InputLabel sx={{ color: "black" }} htmlFor="educationBackground">
            Education Background
          </InputLabel>
          <OutlinedInput
            id="educationBackground"
            name="educationBackground"
            label="Education Background"
            value={editedFields?.educationBackground || ""}
            onChange={handleChange}
            disabled={!isEditing}
            startAdornment=" "
          />
        </FormControl>
      </div>

      <div style={{ width: "100%" }}>
        {/* Comments */}
        <FormControl sx={{ mx: 2, width: "81ch" }}>
          <InputLabel htmlFor="comments">Comments</InputLabel>
          <OutlinedInput
            id="comments"
            name="comments"
            label="Comments"
            multiline
            rows={4}
            value={editedFields?.comments || ""}
            onChange={handleChange}
            disabled={!isEditing}
            startAdornment=" "
          />
        </FormControl>
      </div>
    </Box>
  );
};
