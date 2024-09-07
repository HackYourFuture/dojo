import { SidebarLearningStatus } from '.';
import { Chip, Stack } from '@mui/material';
import { JobPath, LearningStatus } from '../models';

interface JobPathProps {
  jobPath: JobPath | string;
}
/**
 * Component for showing jobPath status chip on the sidebar for profile page.
 *
 * @param {JobPath} jobPath enum with job path status.
 * @returns {ReactNode} A React element that renders a stack of jobPath chip on profile sidebar.
 */
export const SidebarJobPath = ({ jobPath }: JobPathProps) => {
  /**
   * Function that returns color value attribute to MUI Chip component.
   */
  const jobChipColor = (status: JobPath | string) => {
    switch (status) {
      case JobPath.Searching:
        return 'primary';
      case JobPath.Internship:
      case JobPath.TechJob:
        return 'success';
      case JobPath.NotSearching:
        return 'warning';
      case JobPath.NonTechJob:
      case JobPath.OtherStudies:
      case JobPath.NoLongerHelping:
        return 'error';
    }
  };

  return (
    <Stack direction="row" spacing={1} p={0}>
      <SidebarLearningStatus learningStatus={LearningStatus.Graduated}></SidebarLearningStatus>{' '}
      <Chip label={jobPath} color={jobChipColor(jobPath)} size="small" />
    </Stack>
  );
};
