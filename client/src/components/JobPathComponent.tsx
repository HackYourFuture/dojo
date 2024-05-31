import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import { JobPath, LearningStatus } from "../types";


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const JobPathComponent = ({ jobPath }: (any)) => {

  const jobChipColor = (status: JobPath) => {
    let color;
    switch (status) {
      case JobPath.Searching:
        return color = "primary";
      case JobPath.Internship || JobPath.TechJob:
        return color = "success";
      case JobPath.NotSearching:
        return color = "warning";
      case JobPath.NonTechJob || JobPath.OtherStudies || JobPath.NoLongerHelping:
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        return color = "error";
    }
  };
  
  return(
    <Paper
      elevation={0}
      sx={{
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        p: 1,
        m: 0,
      }}
    >
      <Stack direction="row" spacing={2}>
        <Chip label={LearningStatus.Graduated} color="success" size="small"/>
        <Chip label={jobPath} color={jobChipColor(jobPath)} size="small"/>
      </Stack>
    </Paper>
  );
};