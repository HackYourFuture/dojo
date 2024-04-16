import { useState } from "react";
import {
  ProfileInfo,
  ProfileNav,
  PersonalInfo,
  ContactInfo,
  EducationInfo,
  EmploymentInfo,
} from "./index";
import { Box } from "@mui/material";

export const TraineeProfilePage = () => {
  const [activeTab, setActiveTab] = useState("personal"); // Default active tab

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div style={{ display: "flex", background: "#ecfef6" }}>
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
        {activeTab === "personal" && <PersonalInfo />}
        {activeTab === "contact" && <ContactInfo />}
        {activeTab === "education" && <EducationInfo />}
        {activeTab === "employment" && <EmploymentInfo />}
      </Box>
    </div>
  );
};
