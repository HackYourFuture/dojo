import React, { ReactNode, useState } from "react";
import { useParams } from "react-router-dom";
import { useTraineeInfoData } from "../hooks/useTraineeInfoData";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import { Comment } from "./Comment";

import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
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
    <Box display="flex" flexDirection="column" gap={4} padding="24px">
      {/* First Name */}
      <Box display="flex" gap={2} alignItems="center">
        <InputLabel
          sx={{ minWidth: "180px", color: "black" }}
          htmlFor="firstName"
        >
          First Name:
        </InputLabel>
        <TextField
          hiddenLabel
          id="firstName"
          name="firstName"
          value={traineeData?.firstName || ""}
          onChange={handleChange}
          disabled={!isEditing}
          variant="standard"
          sx={{ minWidth: "180px" }}
        />
      </Box>

      {/* Last Name */}
      <Box display="flex" gap={2} alignItems="center">
        <InputLabel
          sx={{ minWidth: "180px", color: "black" }}
          htmlFor="lastName"
        >
          Last Name:
        </InputLabel>
        <TextField
          hiddenLabel
          id="lastName"
          name="lastName"
          value={traineeData?.lastName || ""}
          onChange={handleChange}
          disabled={!isEditing}
          variant="standard"
          sx={{ minWidth: "180px" }}
        />
      </Box>

      {/* Preferred Name */}
      <Box display="flex" gap={2} alignItems="center">
        <InputLabel
          sx={{ minWidth: "180px", color: "black" }}
          htmlFor="preferredName"
        >
          Preferred Name:
        </InputLabel>
        <TextField
          hiddenLabel
          id="preferredName"
          name="preferredName"
          value={traineeData?.preferredName || ""}
          onChange={handleChange}
          disabled={!isEditing}
          variant="standard"
          sx={{ minWidth: "180px" }}
        />
      </Box>

      {/* Gender */}
      <FormControl
        sx={{
          flexDirection: "row",
          color: "black",
          gap: "1rem",
          alignItems: "center",
        }}
      >
        <Typography sx={{ minWidth: "180px" }}>Gender: </Typography>
        <Select
          value={traineeData?.gender || ""}
          name="gender"
          id="gender"
          onChange={handleSelectChange}
          disabled={!isEditing}
          variant="standard"
          sx={{ minWidth: "180px" }}
        >
          <MenuItem value="male">Male</MenuItem>
          <MenuItem value="female">Female</MenuItem>
          <MenuItem value="other">Other</MenuItem>
        </Select>
      </FormControl>

      {/* Pronouns */}
      <FormControl
        sx={{
          flexDirection: "row",
          color: "black",
          gap: "1rem",
          alignItems: "center",
        }}
      >
        <Typography sx={{ minWidth: "180px" }}>Pronouns:</Typography>
        <Select
          value={traineeData?.pronouns || ""}
          name="pronouns"
          id="pronouns"
          onChange={handleSelectChange}
          disabled={!isEditing}
          variant="standard"
          sx={{ minWidth: "180px" }}
        >
          <MenuItem value="he">He/His</MenuItem>
          <MenuItem value="she">She/Her</MenuItem>
          <MenuItem value="they">They/Their</MenuItem>
        </Select>
      </FormControl>

      {/* Location */}
      <Box display="flex" gap={2} alignItems="center">
        <InputLabel
          sx={{ minWidth: "180px", color: "black" }}
          htmlFor="location"
        >
          Location:
        </InputLabel>
        <TextField
          hiddenLabel
          name="location"
          id="location"
          value={traineeData?.location || ""}
          onChange={handleChange}
          disabled={!isEditing}
          variant="standard"
          sx={{ minWidth: "180px" }}
        />
      </Box>

      {/* Country of Origin */}
      <Box display="flex" gap={2} alignItems="center">
        <InputLabel
          sx={{ minWidth: "180px", color: "black" }}
          htmlFor="countryOfOrigin"
        >
          Country of Origin:
        </InputLabel>
        <TextField
          hiddenLabel
          name="countryOfOrigin"
          id="countryOfOrigin"
          value={traineeData?.countryOfOrigin || ""}
          onChange={handleChange}
          disabled={!isEditing}
          variant="standard"
          sx={{ minWidth: "180px" }}
        />
      </Box>

      {/* Background */}
      <FormControl
        sx={{
          flexDirection: "row",
          color: "black",
          gap: "1rem",
          alignItems: "center",
        }}
      >
        <Typography sx={{ minWidth: "180px" }}>Background:</Typography>
        <Select
          value={traineeData?.background || ""}
          name="background"
          id="background"
          onChange={handleSelectChange}
          disabled={!isEditing}
          variant="standard"
          sx={{ minWidth: "180px" }}
        >
          <MenuItem value="eu-citizen">EU citizen</MenuItem>
          <MenuItem value="family-reunification">Family reunification</MenuItem>
          <MenuItem value="partner-of-skilled-migrant">
            Partner of a skilled migrant
          </MenuItem>
          <MenuItem value="refugee">Refugee</MenuItem>
          <MenuItem value="vulnerable-group">Vulnerable group</MenuItem>
        </Select>
      </FormControl>

      {/* Work Permit */}
      <FormControl
        sx={{
          flexDirection: "row",
          color: "black",
          gap: "1rem",
          alignItems: "center",
        }}
      >
        <Typography sx={{ minWidth: "180px" }}>Work Permit:</Typography>
        <Select
          value={traineeData?.hasWorkPermit || ""}
          name="hasWorkPermit"
          id="hasWorkPermit"
          onChange={handleSelectChange}
          disabled={!isEditing}
          variant="standard"
          sx={{ minWidth: "180px" }}
        >
          <MenuItem value="yes">Yes</MenuItem>
          <MenuItem value="no">No</MenuItem>
        </Select>
      </FormControl>

      {/* Residency Status */}
      <FormControl
        sx={{
          flexDirection: "row",
          color: "black",
          gap: "1rem",
          alignItems: "center",
        }}
      >
        <Typography sx={{ minWidth: "180px" }}>Residency Status:</Typography>
        <Select
          value={traineeData?.residencyStatus || ""}
          name="residencyStatus"
          id="residencyStatus"
          onChange={handleSelectChange}
          disabled={!isEditing}
          variant="standard"
          sx={{ minWidth: "180px" }}
        >
          <MenuItem value="first-interview">First Interview</MenuItem>
          <MenuItem value="second-interview">Second Interview</MenuItem>
          <MenuItem value="residency">Residency</MenuItem>
          <MenuItem value="citizenship">Citizenship</MenuItem>
        </Select>
      </FormControl>

      {/* Social Benefits */}
      <FormControl
        sx={{
          flexDirection: "row",
          color: "black",
          gap: "1rem",
          alignItems: "center",
        }}
      >
        <Typography sx={{ minWidth: "180px" }}>Social Benefits:</Typography>
        <Select
          value={traineeData?.receivesSocialBenefits || ""}
          name="receivesSocialBenefits"
          id="receivesSocialBenefits"
          onChange={handleSelectChange}
          disabled={!isEditing}
          variant="standard"
          sx={{ minWidth: "180px" }}
        >
          <MenuItem value="yes">Yes</MenuItem>
          <MenuItem value="no">No</MenuItem>
        </Select>
      </FormControl>

      {/* Case Manager Urging */}
      <FormControl
        sx={{
          flexDirection: "row",
          color: "black",
          gap: "1rem",
          alignItems: "center",
        }}
      >
        <Typography sx={{ minWidth: "180px" }}>Case Manager Urging:</Typography>
        <Select
          value={traineeData?.caseManagerUrging || ""}
          name="caseManagerUrging"
          id="caseManagerUrging"
          onChange={handleSelectChange}
          disabled={!isEditing}
          variant="standard"
          sx={{ minWidth: "180px" }}
        >
          <MenuItem value="yes">Yes</MenuItem>
          <MenuItem value="no">No</MenuItem>
        </Select>
      </FormControl>

      {/* English Level */}
      <FormControl
        sx={{
          flexDirection: "row",
          color: "black",
          gap: "1rem",
          alignItems: "center",
        }}
      >
        <Typography sx={{ minWidth: "180px" }}>English Level:</Typography>
        <Select
          value={traineeData?.englishLevel || ""}
          name="englishLevel"
          id="englishLevel"
          onChange={handleSelectChange}
          disabled={!isEditing}
          variant="standard"
          sx={{ minWidth: "180px" }}
        >
          <MenuItem value="needs-work">Needs work</MenuItem>
          <MenuItem value="moderate">Moderate</MenuItem>
          <MenuItem value="good">Good</MenuItem>
        </Select>
      </FormControl>

      {/* Professional Dutch */}
      <FormControl
        sx={{
          flexDirection: "row",
          color: "black",
          gap: "1rem",
          alignItems: "center",
        }}
      >
        <Typography sx={{ minWidth: "180px" }}>Professional Dutch:</Typography>
        <Select
          value={traineeData?.professionalDutch || ""}
          name="professionalDutch"
          id="professionalDutch"
          onChange={handleSelectChange}
          disabled={!isEditing}
          variant="standard"
          sx={{ minWidth: "180px" }}
        >
          <MenuItem value="yes">Yes</MenuItem>
          <MenuItem value="no">No</MenuItem>
        </Select>
      </FormControl>

      {/* Education Level */}
      <FormControl
        sx={{
          flexDirection: "row",
          color: "black",
          gap: "1rem",
          alignItems: "center",
        }}
      >
        <Typography sx={{ minWidth: "180px" }}>Education Level:</Typography>
        <Select
          value={traineeData?.educationLevel || ""}
          name="educationLevel"
          id="educationLevel"
          onChange={handleSelectChange}
          disabled={!isEditing}
          variant="standard"
          sx={{ minWidth: "180px" }}
        >
          <MenuItem value="none">None</MenuItem>
          <MenuItem value="high-school">High school</MenuItem>
          <MenuItem value="diploma">Diploma</MenuItem>
          <MenuItem value="bachelors-degree">Bachelors degree</MenuItem>
          <MenuItem value="masters-degree">Masters degree</MenuItem>
        </Select>
      </FormControl>

      {/* Education Background */}
      <Box display="flex" gap={2} alignItems="center">
        <InputLabel
          sx={{ minWidth: "180px", color: "black" }}
          htmlFor="educationBackground"
        >
          Education Background:
        </InputLabel>
        <TextField
          hiddenLabel
          name="educationBackground"
          id="educationBackground"
          value={traineeData?.educationBackground || ""}
          onChange={handleChange}
          disabled={!isEditing}
          variant="standard"
          sx={{ minWidth: "180px" }}
        />
      </Box>

      <Box>
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
      <Comment />
    </Box>
  );
};
