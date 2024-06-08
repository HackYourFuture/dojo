import { useParams } from "react-router-dom";
import { useTraineeInfoData } from "../hooks/useTraineeInfoData";
import { Loader, TraineeProfile } from "../components";
import { Alert, AlertTitle, Box } from "@mui/material";

export const TraineePage = () => {
  const { traineeInfo } = useParams();
  const trainee = traineeInfo?.split("_");
  const traineeId = trainee ? trainee[1] : "";
  const { isLoading, isError, error, isFetching } =
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

  return <TraineeProfile id={traineeId} />;
};
