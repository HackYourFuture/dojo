import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import { JobPath, LearningStatus } from "../types";

interface JobPathComponentProps {
  jobPath: JobPath
}

export const JobPathComponent = ({jobPath}: JobPathComponentProps) => {
  const jobChipColor = (status: JobPath) => {
    switch (status) {
      case JobPath.Searching:
        return "primary";
      case JobPath.Internship:
      case JobPath.TechJob:
        return "success";
      case JobPath.NotSearching:
        return "warning";
      case JobPath.NonTechJob:
      case JobPath.OtherStudies:
      case JobPath.NoLongerHelping:
        return "error";
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