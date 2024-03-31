import { useParams } from "react-router-dom";
import { useTraineeInfoData } from "../hooks/useTraineeInfoData";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import CircularProgress from "@mui/material/CircularProgress";

export const  TraineePage = () => {
  const { traineeInfo } = useParams();
  const trainee = traineeInfo?.split("-");
  const traineeId = trainee ? trainee[1] : ""
  const { isLoading, data, isError, error, isFetching } = useTraineeInfoData(traineeId);

  if(isLoading || isFetching) {
    return (
      <Box p={4} sx={{ display: 'flex' }}>
        <CircularProgress />
      </Box>
    )
  }

  if(isError && error instanceof Error) {
    return (
      <Box p={4} sx={{ width: '100%' }}>
        <Alert severity="error">
          <AlertTitle>Error</AlertTitle>
          {error.message}
        </Alert>
      </Box>
    )
  }

  return (
    <>
      <h2>Trainee Page</h2>
      <div>
        {data?.data.id}
      </div>
    </>
  )
}
