import Chip from "@mui/material/Chip"
import { LearningStatus } from "../types"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const LearningStatusComponent = ({ learningStatus }: (any)) => {

  const chipColor = (status: LearningStatus) => {
    let color;
    switch (status) {
      case LearningStatus.Studying:
        return color = "primary";
      case LearningStatus.Graduated:
        return color = "success";
      case LearningStatus.OnHold:
        return color = "warning";
      case LearningStatus.Quit:
        return color = "error";
      default: 
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        return color = "success";
    }
  }

  return (
    <Chip label={learningStatus} color={chipColor(learningStatus)} />
  );
};
