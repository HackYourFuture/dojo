import { Chip } from '@mui/material';
import { LearningStatus } from '../models';

interface LearningStatusProps {
  learningStatus: LearningStatus | string | undefined;
}
/**
 * Component for showing learning status chip on the sidebar for profile page.
 *
 * @param {LearningStatus | undefined} learningStatus enum with learning statuses.
 * @returns {ReactNode} A React element that renders a stack of learningStatus chip on profile sidebar.
 */
export const SidebarLearningStatus = ({ learningStatus }: LearningStatusProps) => {
  /**
   * Function that returns color value attribute to MUI Chip component.
   */
  const chipColor = (status: LearningStatus | string | undefined) => {
    switch (status) {
      case LearningStatus.Studying:
        return 'primary';
      case LearningStatus.Graduated:
        return 'success';
      case LearningStatus.OnHold:
        return 'warning';
      case LearningStatus.Quit:
        return 'error';
    }
  };

  return <Chip label={learningStatus} color={chipColor(learningStatus)} size="small" />;
};
