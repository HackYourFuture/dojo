import { Box, Icon, IconButton, List, ListItem, ListItemText, Tooltip, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Test, TestResult } from '../../models';
import { CheckCircle, OfflinePin, CancelSharp, Error } from '@mui/icons-material';
import { formatDateForDisplay } from '../../helpers/dateHelper';
import { formatTextToFriendly } from '../../helpers/formHelper';
import MarkdownText from '../shared/MarkdownText';

interface TestsListProps {
  tests: Test[];
  onClickEdit: (id: string) => void;
  onClickDelete: (id: string) => void;
}

export const TestsList: React.FC<TestsListProps> = ({ tests, onClickEdit, onClickDelete }) => {
  const resultIconMap = (testResult: TestResult) => {
    switch (testResult) {
      case TestResult.Passed:
        return <CheckCircle color="success" />;
      case TestResult.PassedWithWarning:
        return <OfflinePin color="warning" />;
      case TestResult.Failed:
        return <CancelSharp color="error" />;
      case TestResult.Disqualified:
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
      {tests.length === 0 ? (
        <Typography variant="body1" color="#CCCCCC" padding="16px">
          No tests found
        </Typography>
      ) : (
        tests.map((test: Test, index: number) => {
          return (
            <Box key={test.id}>
              <ListItem
                alignItems="flex-start"
                disablePadding
                sx={{
                  paddingBottom: 1,
                  bgcolor: index % 2 === 0 ? '#f8f9fa' : 'background.paper',
                }}
              >
                <ListItemText
                  primary={
                    <Box
                      display="flex"
                      flexDirection="row"
                      justifyContent="space-between"
                      width="100%"
                      paddingTop={1}
                      paddingBottom={1}
                    >
                      <Box display="flex" sx={{ gap: 1 }}>
                        <Tooltip title={formatTextToFriendly(test.result || '')}>{resultIconMap(test.result)}</Tooltip>
                        {formatTextToFriendly(test.type || '')}
                      </Box>
                      <Typography sx={{ paddingRight: 2 }}>{test.score ?? 'N/A'}</Typography>
                      <Typography sx={{ paddingRight: 2 }}>{formatDateForDisplay(test.date)}</Typography>
                    </Box>
                  }
                  secondary={<MarkdownText>{test.comments ?? ''}</MarkdownText>}
                />
                {renderActions(test.id)}
              </ListItem>
            </Box>
          );
        })
      )}
    </List>
  );
};
