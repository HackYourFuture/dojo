import { EmploymentHistory } from '../../../data/types/Trainee';
import { Box, IconButton, List, ListItem, ListItemText, Tooltip, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import React from 'react';
import { formatDateForDisplay } from '../utils/dateHelper';

interface EmploymentHistoryListProps {
  employmentHistory: EmploymentHistory[];
  onClickEdit: (id: string) => void;
  onClickDelete: (id: string) => void;
}

export const EmploymentHistoryList: React.FC<EmploymentHistoryListProps> = ({ employmentHistory, onClickEdit, onClickDelete }) => {

  /**
   * Formats text to have the first letter capitalized
   * @param string - The string to format
   * @returns The formatted string
   */
  const capitalize = (string: string): string => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

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
        backgroundColor: 'background.paper',
        maxHeight: 300,
        overflow: 'auto',
        scrollbarWidth: 'thin',
      }}
    >
      {employmentHistory.length === 0 ? (
        <Typography variant="body1" color="#CCCCCC" padding="16px">
          No employment history found
        </Typography>
      ) : (
        employmentHistory.map((employment: EmploymentHistory, index: number) => {
          return (
            <Box key={employment.id}>
              <ListItem
                alignItems="flex-start"
                disablePadding
                sx={{
                  backgroundColor: index % 2 === 0 ? 'background.paperAlt' : 'background.paper',
                }}
              >
                <ListItemText
                  sx={{
                    px: 2,
                  }}
                  primary={
                    <Box width="100%" pt={1} pb={2}>
                      {employment.companyName}
                    </Box>
                  }
                  secondary={
                    <Box mt={-2} py={1}>
                      <Box>
                        <Typography variant="body2">
                          {employment.role} • {capitalize(employment.type)}
                        </Typography>
                        <Typography variant="body2">
                          Start: {formatDateForDisplay(employment.startDate)}
                          {employment.endDate ? ' • ' + 'End: ' + formatDateForDisplay(employment.endDate) : ''}
                        </Typography>
                      </Box>
                      {employment.comments && <Typography variant="subtitle1" pt={1}>{employment.comments}</Typography>}
                    </Box>
                  }
                />
                <Box>
                  {renderActions(employment.id)}
                  <Tooltip title="Education fee">
                    <Typography>€ {employment.feeAmount || '---'}</Typography>
                  </Tooltip>
                </Box>
              </ListItem>
            </Box>
          );
        })
      )}
    </List>
  );
};