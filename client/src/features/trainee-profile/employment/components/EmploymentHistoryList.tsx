import { EmploymentHistory } from '../models/employment-history';
import { Box, List, ListItem, ListItemText, Tooltip, Typography } from '@mui/material';
import { ListItemActions } from '../../components/ListItemActions';
import React from 'react';
import { formatDateForDisplay } from '../../utils/dateHelper';
import { formatTextToFriendly } from '../../utils/formHelper';

interface EmploymentHistoryListProps {
  employmentHistory: EmploymentHistory[];
  onClickEdit: (id: string) => void;
  onClickDelete: (id: string) => void;
}

export const EmploymentHistoryList: React.FC<EmploymentHistoryListProps> = ({
  employmentHistory,
  onClickEdit,
  onClickDelete,
}) => {
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
        <Typography variant="body1" color="text.secondary" padding="16px">
          No employment history found
        </Typography>
      ) : (
        employmentHistory.map((employment: EmploymentHistory, index: number) => {
          return (
            <ListItem
              key={employment.id}
              alignItems="flex-start"
              disablePadding
              sx={{
                backgroundColor: index % 2 === 0 ? 'background.paperAlt' : 'background.paper',
              }}
            >
              <Box px={2} width="100%">
                <ListItemText
                  // A div, since the secondary text holds paragraphs, which cannot be inside the default <p>.
                  slotProps={{ secondary: { component: 'div' } }}
                  primary={
                    <Box pt={1} fontWeight="bold">
                      {employment.companyName}
                    </Box>
                  }
                  secondary={
                    <Box py={1}>
                      <Typography variant="body2">
                        {employment.role} • {formatTextToFriendly(employment.type)}
                      </Typography>
                      <Typography variant="body2">
                        Start: {formatDateForDisplay(employment.startDate)}
                        {employment.endDate && ` • End: ${formatDateForDisplay(employment.endDate)}`}
                      </Typography>
                    </Box>
                  }
                />
                {employment.comments && (
                  <Typography variant="subtitle1" pb={2}>
                    {employment.comments}
                  </Typography>
                )}
              </Box>
              <Box>
                <ListItemActions
                  onEdit={() => onClickEdit(employment.id)}
                  onDelete={() => onClickDelete(employment.id)}
                />
                <Tooltip title="Education fee">
                  <Typography>€ {employment.feeAmount ?? '---'}</Typography>
                </Tooltip>
              </Box>
            </ListItem>
          );
        })
      )}
    </List>
  );
};
