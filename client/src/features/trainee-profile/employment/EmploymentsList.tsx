import { EmploymentHistory } from '../../../data/types/Trainee.ts';
import { Box, IconButton, List, ListItem, ListItemText, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MarkdownText from '../components/MarkdownText.tsx';
import React from 'react';
import { formatDateForDisplay } from '../utils/dateHelper.ts';

interface EmploymentsListProps {
  employments: EmploymentHistory[];
  onClickEdit: (id: string) => void;
  onClickDelete: (id: string) => void;
}

export const EmploymentsList: React.FC<EmploymentsListProps> = ({ employments, onClickEdit, onClickDelete }) => {

  const handleEdit = (id: string) => {
    onClickEdit(id);
  };
  const handleDelete = (id: string) => {
    onClickDelete(id);
  };

  const renderActions = (id: string) => {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 1 }}>
        <IconButton aria-label="edit" onClick={() => handleEdit(id)}>
          <EditIcon />
        </IconButton>
        <IconButton aria-label="delete" onClick={() => handleDelete(id)}>
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
      {employments.length === 0 ? (
        <Typography variant="body1" color="#CCCCCC" padding="16px">
          No employments found
        </Typography>
      ) : (
        employments.map((employment: EmploymentHistory, index: number) => {
          return (
            <Box key={employment.id}>
              <ListItem
                alignItems="flex-start"
                disablePadding
                sx={{
                  bgcolor: index % 2 === 0 ? 'background.paperAlt' : 'background.paper',
                }}
              >
                <ListItemText
                  sx={{
                    paddingLeft: 2,
                    paddingRight: 2,
                    paddingTop: 1,
                  }}
                  primary={
                    <Box
                      display="flex"
                      flexDirection="row"
                      justifyContent="space-between"
                      width="100%"
                      paddingTop={1}
                      paddingBottom={1}
                    >
                      <Typography>{employment.companyName}</Typography>
                    </Box>
                  }
                  secondary={
                    <Box mt={-2}>
                      <MarkdownText>{employment.role + ' • ' + employment.type}</MarkdownText>
                      <MarkdownText>
                        {'Start: ' +
                          formatDateForDisplay(employment.startDate) +
                          (employment.endDate ? ' • ' + 'End: ' + formatDateForDisplay(employment.endDate) : '')}
                      </MarkdownText>
                      <Typography>{employment.comments}</Typography>
                      <Typography>{"€" + employment.feeAmount || "---"}</Typography>
                    </Box>
                  }
                />
                {renderActions(employment.id)}
              </ListItem>
            </Box>
          );
        })
      )}
    </List>
  );
};