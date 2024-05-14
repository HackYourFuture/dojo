/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import {
  ProfileInfo,
  ProfileNav,
  PersonalInfo,
  ContactInfo,
  EducationInfo,
  EmploymentInfo,
} from "./index";
import { Alert, AlertTitle, Box } from "@mui/material";
import { Loader } from "./Loader";
import { useParams } from "react-router-dom";
import { useTraineeInfoData } from "../hooks/useTraineeInfoData";
import { TraineeInfo } from "../types";
import axios from "axios";

export const TraineeProfilePage = () => {
  // Default active tab
  const [activeTab, setActiveTab] = useState("personal");

  const { traineeInfo } = useParams();
  const trainee = traineeInfo?.split("_");
  const traineeId = trainee ? trainee[1] : "";
  const { isLoading, isError, data, error, isFetching } =
    useTraineeInfoData(traineeId);

  const [traineeData, setTraineeData] = useState(data && data);

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

  const saveTraineeData = async (editedData: Partial<TraineeInfo>) => {
    try {
      const response = await axios.patch(
        `/api/trainees/${traineeId}`,
        editedData
      );
      console.log("Trainee data saved successfully", response.data);
      setTraineeData(response.data);
    } catch (error: any) {
      console.error("There was a problem saving trainee data:", error.message);
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
        <ProfileInfo />
      </Box>
      <Box width="100%" paddingY="16px">
        <ProfileNav activeTab={activeTab} onTabChange={handleTabChange} />
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
        {activeTab === "education" && <EducationInfo />}
        {activeTab === "employment" && <EmploymentInfo />}
      </Box>
    </div>
  );
};
