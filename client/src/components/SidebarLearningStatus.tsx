import { Chip } from '@mui/material';
import { LearningStatus } from '../data/types/Trainee';

interface LearningStatusProps {
  learningStatus: LearningStatus | undefined;
}
/**
 * Component for showing learning status chip on the sidebar for profile page.
 *
 * @param {LearningStatus} learningStatus enum with learning statuses.
 * @returns {ReactNode} A React element that renders a stack of learningStatus chip on profile sidebar.
 */
export const SidebarLearningStatus = ({ learningStatus }: LearningStatusProps) => {
  /**
   * Function that returns color value attribute to MUI Chip component.
   */
  const chipColor = (status: LearningStatus | undefined) => {
    switch (status) {
      case LearningStatus.Studying:
        return 'info';
      case LearningStatus.Graduated:
        return 'success';
      case LearningStatus.OnHold:
        return 'warning';
      case LearningStatus.Quit:
        return 'error';
    }
  };

  const chipLabel = (status: LearningStatus | undefined) => {
    switch (status) {
      case LearningStatus.Studying:
        return 'Studying';
      case LearningStatus.Graduated:
        return 'Graduated';
      case LearningStatus.OnHold:
        return 'On Hold';
      case LearningStatus.Quit:
        return 'Quit';
    }
  };

  return <Chip label={chipLabel(learningStatus)} color={chipColor(learningStatus)} size="small" />;
};

export default SidebarLearningStatus;
