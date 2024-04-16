import { Alert, AlertTitle, Avatar, Box, Typography } from "@mui/material";
import slackLogo from "../assets/slack.png";
import githubLogo from "../assets/github.png";
import { useTraineeInfoData } from "../hooks/useTraineeInfoData";
import { useParams } from "react-router-dom";
import { Loader } from "./Loader";

export const ProfileInfo = () => {
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

  return (
    <Box
      display="flex"
      flexDirection="column"
      gap={2}
      alignItems="center"
      color="black"
      bgcolor="#d1fbe6"
      height="100vh"
      paddingX={4}
      paddingY={4}
    >
      {/* replace later with image */}
      <div
        style={{
          width: "100%",
          maxWidth: "240px",
          borderRadius: "8px",
          overflow: "hidden",
        }}
      >
        <Avatar
          variant="square"
          sx={{ width: "100%", height: "auto" }}
          alt="Profile Picture"
        />
      </div>

      {/* Name */}
      <Typography variant="h6" fontWeight="bold">
        {data?.personalInfo.firstName} {data?.personalInfo.lastName}
      </Typography>

      {/* replace later with real data */}
      <Typography variant="body1" color="text.secondary">
        Trainee
      </Typography>

      <Typography
        variant="body2"
        bgcolor="#4cde80"
        paddingX="10px"
        borderRadius="20px"
      >
        Studying
      </Typography>

      {/* replace later with real data */}
      <Typography variant="body1" color="text.secondary">
        Cohort 55
      </Typography>

      {/* replace later with real data */}
      <div style={{ display: "flex", justifyContent: "center", gap: "16px" }}>
        <a href="#" className="text-blue-500 hover:text-blue-700">
          <img
            src={slackLogo}
            alt="Slack"
            width="32"
            height="32"
            style={{ borderRadius: "50%" }}
          />
        </a>
        <a href="#" className="text-gray-700 hover:text-gray-900">
          <img
            src={githubLogo}
            alt="GitHub"
            width="32"
            height="32"
            style={{ borderRadius: "50%" }}
          />
        </a>
      </div>
    </Box>
  );
};
