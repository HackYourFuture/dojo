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

export const TraineeProfilePage = () => {
  // Default active tab
  const [activeTab, setActiveTab] = useState("personal");

  const { traineeInfo } = useParams();
  const trainee = traineeInfo?.split("-");
  const traineeId = trainee ? trainee[1] : "";
  const { isLoading, isError, data, error, isFetching } =
    useTraineeInfoData(traineeId);

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

  const saveTraineeData = (editedData: Partial<TraineeInfo>) => {
    console.log("Save edited data:", editedData);
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
            traineeData={data && data.personalInfo}
            saveTraineeData={saveTraineeData}
          />
        )}
        {activeTab === "contact" && (
          <ContactInfo
            contactData={data && data.contactInfo}
            saveTraineeData={saveTraineeData}
          />
        )}
        {activeTab === "education" && <EducationInfo />}
        {activeTab === "employment" && <EmploymentInfo />}
      </Box>
    </div>
  );
};
