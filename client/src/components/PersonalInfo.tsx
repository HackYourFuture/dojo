import React, { ReactNode, useState } from "react";
import { useParams } from "react-router-dom";
import { useTraineeInfoData } from "../hooks/useTraineeInfoData";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";

import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { Loader } from "./Loader";

interface TraineeData {
  id: string;
  firstName: string;
  lastName: string;
  preferredName: string;
  gender: string;
  pronouns: string;
  location: string;
  englishLevel: string;
  professionalDutch: boolean;
  countryOfOrigin: string;
  background: string;
  hasWorkPermit: boolean;
  residencyStatus: string;
  receivesSocialBenefits: boolean;
  caseManagerUrging: boolean;
  educationLevel: string;
  educationBackground: string;
  comments: string;
}

export const PersonalInfo = () => {
  const { traineeInfo } = useParams();
  const trainee = traineeInfo?.split("-");
  const traineeId = trainee ? trainee[1] : "";
  const { isLoading, isError, data, error, isFetching } =
    useTraineeInfoData(traineeId);
  const [traineeData, setTraineeData] = useState<TraineeData | null>(
    data && data.personalInfo ? data.personalInfo : null
  );

  const [isEditing, setIsEditing] = useState(false);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    setIsEditing(false);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | { name?: string; value: ReactNode }>
  ) => {
    const { name, value } = e.target;
    setTraineeData((prevData) => ({
      ...prevData!,
      [name!]: value,
    }));
  };

  const handleSelectChange = (
    event: SelectChangeEvent<
      string | boolean | { name?: string; value: ReactNode }
    >
  ) => {
    const { name, value } = event.target;
    setTraineeData((prevData) => ({
      ...prevData!,
      [name!]: value,
    }));
  };

  if (isLoading || isFetching) {
    return <Loader />;
  }

  if (isError && error instanceof Error) {
    return (
      <Box p={8} sx={{ width: "100%" }}>
        <Alert severity="error">
          <AlertTitle>Error</AlertTitle>
          {error.message}
        </Alert>
      </Box>
    );
  }

  return (
    <Box
      display="flex"
      flexDirection="row"
      flexWrap="wrap"
      gap={4}
      padding="24px"
    >
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
            value={traineeData?.firstName || ""}
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
            value={traineeData?.lastName || ""}
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
            value={traineeData?.preferredName || ""}
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
            value={traineeData?.gender || ""}
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
            value={traineeData?.pronouns || ""}
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
            value={traineeData?.location || ""}
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
            value={traineeData?.countryOfOrigin || ""}
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
            value={traineeData?.background || ""}
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
            value={traineeData?.hasWorkPermit || ""}
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
            value={traineeData?.residencyStatus || ""}
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
            value={traineeData?.receivesSocialBenefits || ""}
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
            value={traineeData?.caseManagerUrging || ""}
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
            value={traineeData?.englishLevel || ""}
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
            value={traineeData?.professionalDutch || ""}
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
            value={traineeData?.educationLevel || ""}
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
            value={traineeData?.educationBackground || ""}
            onChange={handleChange}
            disabled={!isEditing}
            startAdornment=" "
          />
        </FormControl>
      </div>

      {/* Comments */}
      <FormControl fullWidth sx={{ mx: 2 }}>
        <InputLabel htmlFor="comments">Comments</InputLabel>
        <OutlinedInput
          id="comments"
          name="comments"
          label="Comments"
          multiline
          rows={4}
          value={traineeData?.comments || ""}
          onChange={handleChange}
          disabled={!isEditing}
          startAdornment=" "
        />
      </FormControl>

      <Box sx={{ mx: 2 }}>
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
    </Box>
  );
};
