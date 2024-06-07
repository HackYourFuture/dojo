import { Chip } from "@mui/material";
import { LearningStatusProps, LearningStatus } from "../types";

export const LearningStatusComponent = ({
  learningStatus,
}: LearningStatusProps) => {
  const chipColor = (status: LearningStatus | undefined) => {
    switch (status) {
      case LearningStatus.Studying:
        return "primary";
      case LearningStatus.Graduated:
        return "success";
      case LearningStatus.OnHold:
        return "warning";
      case LearningStatus.Quit:
        return "error";
    }
  };

  return (
    <Chip
      label={learningStatus}
      color={chipColor(learningStatus)}
      size="small"
    />
  );
};
