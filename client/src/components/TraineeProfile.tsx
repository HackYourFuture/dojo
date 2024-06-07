/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import {
  ProfileNav,
  PersonalInfo,
  ContactInfo,
  EducationInfo,
  EmploymentInfo,
  ProfileSidebarComponent,
} from "../components/index";
import { Alert, AlertTitle, Box, Snackbar } from "@mui/material";
import { Loader } from "../components/Loader";
import { useTraineeInfoData } from "../hooks/useTraineeInfoData";
import { Trainee, TraineePageProps } from "../types";
import axios from "axios";

import MuiAlert from "@mui/material/Alert";

export const TraineeProfile = ({id}: TraineePageProps) => {
  // Default active tab
  const [activeTab, setActiveTab] = useState("personal");

  const { isLoading, isError, data, error, isFetching } =
    useTraineeInfoData(id);

  const [traineeData, setTraineeData] = useState(data && data);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
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

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const saveTraineeData = async (editedData: Partial<Trainee>) => {
    console.log("Saving trainee data", editedData);
    try {
      const response = await axios.patch(
        `/api/trainees/${id}`,
        editedData
      );
      console.log("Trainee data saved successfully", response.data);
      setTraineeData(response.data);
      setSnackbarSeverity("success");
      setSnackbarMessage("Trainee data saved successfully");
    } catch (error: any) {
      console.error("There was a problem saving trainee data:", error.message);
      setSnackbarSeverity("error");
      setSnackbarMessage("Error saving trainee data");
      throw error;
    } finally {
      setSnackbarOpen(true);
    }
  };

  return (
    <div style={{ display: "flex", background: "#fff" }}>
      <Box
        width="40%"
        position="sticky"
        top={0}
        left={0}
        height="100%"
        color="black"
        style={{ overflowY: "auto" }}
      >
        <ProfileSidebarComponent traineeId={id} />
      </Box>
      <Box width="100%" paddingY="16px">
        <ProfileNav activeTab={activeTab} onTabChange={handleTabChange} />
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <MuiAlert
            elevation={6}
            variant="filled"
            onClose={handleSnackbarClose}
            severity={snackbarSeverity}
          >
            {snackbarMessage}
          </MuiAlert>
        </Snackbar>
        {activeTab === "personal" && (
          <PersonalInfo
            traineeData={traineeData && traineeData.personalInfo}
            saveTraineeData={saveTraineeData}
          />
        )}
        {activeTab === "contact" && (
          <ContactInfo
            contactData={traineeData && traineeData.contactInfo}
            saveTraineeData={saveTraineeData}
          />
        )}
        {activeTab === "education" && (
          <EducationInfo
            educationData={traineeData && traineeData.educationInfo}
            saveTraineeData={saveTraineeData}
          />
        )}
        {activeTab === "employment" && (
          <EmploymentInfo
            employmentData={traineeData && traineeData.employmentInfo}
            saveTraineeData={saveTraineeData}
          />
        )}
      </Box>
    </div>
  );
};
