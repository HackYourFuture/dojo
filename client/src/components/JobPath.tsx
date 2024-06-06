import { LearningStatusComponent } from ".";
import { JobPath, JobPathComponentProps, LearningStatus } from "../types";
import { Chip, Stack } from "@mui/material";

export const JobPathComponent = ({ jobPath }: JobPathComponentProps) => {
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

  return (
    <Stack direction="row" spacing={2} p={1}>
      <LearningStatusComponent
        learningStatus={LearningStatus.Graduated}
      ></LearningStatusComponent>{" "}
      <Chip label={jobPath} color={jobChipColor(jobPath)} size="small" />
    </Stack>
  );
};
