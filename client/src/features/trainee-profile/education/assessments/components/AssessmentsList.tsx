import { Box, Icon, IconButton, List, ListItem, ListItemText, Tooltip, Typography } from '@mui/material';
import { CancelSharp, CheckCircle, Error, OfflinePin } from '@mui/icons-material';
import { Assessment, AssessmentResult } from '../models/assessment';

import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import GradingIcon from '@mui/icons-material/Grading';
import MarkdownText from '../../../components/MarkdownText';
import { formatDateForDisplay } from '../../../utils/dateHelper';
import { formatTextToFriendly } from '../../../utils/formHelper';

interface AssessmentsListProps {
  assessments: Assessment[];
  onClickEdit: (id: string) => void;
  onClickDelete: (id: string) => void;
}

export const AssessmentsList: React.FC<AssessmentsListProps> = ({ assessments, onClickEdit, onClickDelete }) => {
  const resultIconMap = (assessmentResult: AssessmentResult) => {
    switch (assessmentResult) {
      case AssessmentResult.Passed:
        return <CheckCircle color="success" />;
      case AssessmentResult.PassedWithWarning:
        return <OfflinePin color="warning" />;
      case AssessmentResult.Failed:
        return <CancelSharp color="error" />;
      case AssessmentResult.Disqualified:
        return <Error color="error" />;
      default:
        return <Icon>help_outline</Icon>;
    }
  };

  const renderActions = (id: string) => {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 1 }}>
        <IconButton aria-label="edit" onClick={() => onClickEdit(id)}>
          <EditIcon />
        </IconButton>
        <IconButton aria-label="delete" onClick={() => onClickDelete(id)}>
          <DeleteIcon />
        </IconButton>
      </Box>
    );
  };

  return (
    <List
      sx={{
        width: '100%',
        bgcolor: 'background.paper',
        maxHeight: 300,
        overflow: 'auto',
        scrollbarWidth: 'thin',
      }}
    >
      {assessments.length === 0 ? (
        <Typography variant="body1" color="text.secondary" padding="16px">
          No assessments found
        </Typography>
      ) : (
        assessments.map((assessment: Assessment, index: number) => {
          return (
            <Box key={assessment.id}>
              <ListItem
                alignItems="flex-start"
                disablePadding
                sx={{
                  paddingBottom: 0.5,
                  bgcolor: index % 2 === 0 ? 'action.hover' : 'background.paper',
                }}
              >
                <ListItemText
                  primary={
                    <Box
                      display="flex"
                      flexDirection="row"
                      justifyContent="space-between"
                      width="100%"
                      paddingTop={0.5}
                    >
                      <Box display="flex" flexDirection="row" width="50%" gap={1} ml={1}>
                        <Tooltip title={formatTextToFriendly(assessment.result || '')}>
                          {resultIconMap(assessment.result)}
                        </Tooltip>
                        {formatTextToFriendly(assessment.type || '')}
                      </Box>
                      {assessment.score !== null && (
                        <Tooltip title={'Score'}>
                          <GradingIcon sx={{ fontSize: 18, marginTop: 0.5 }}></GradingIcon>
                        </Tooltip>
                      )}
                      <Typography sx={{ paddingRight: 6 }} aria-label={`Score: ${assessment.score ?? ''}`}>
                        {assessment.score ?? ''}
                      </Typography>
                      <Typography
                        sx={{ paddingRight: 2 }}
                        aria-label={`Date: ${formatDateForDisplay(assessment.date)}`}
                      >
                        {formatDateForDisplay(assessment.date)}
                      </Typography>
                    </Box>
                  }
                  secondary={
                    <Box ml={5} mt={-1}>
                      <MarkdownText>{assessment.comments ?? ''}</MarkdownText>
                    </Box>
                  }
                />
                {renderActions(assessment.id)}
              </ListItem>
            </Box>
          );
        })
      )}
    </List>
  );
};
