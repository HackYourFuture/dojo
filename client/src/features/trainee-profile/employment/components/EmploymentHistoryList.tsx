import { Box, Chip, List, ListItem, Stack, Typography } from '@mui/material';
import { EmploymentHistory, EmploymentType } from '../models/employment-history';

import CheckIcon from '@mui/icons-material/Check';
import { ListItemActions } from '../../../../components/ListItemActions';
import MarkdownText from '../../components/MarkdownText';
import React from 'react';
import { formatDateForDisplay } from '../../utils/dateHelper';
import { formatTextToFriendly } from '../../utils/formHelper';

const feeFormat = new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });

interface EmploymentHistoryListItemProps {
  employment: EmploymentHistory;
  onEdit: () => void;
  onDelete: () => void;
}

/** One job or internship: the company and role, then the type, dates and fee, and the comments. */
const EmploymentHistoryListItem = ({ employment, onEdit, onDelete }: EmploymentHistoryListItemProps) => {
  const { companyName, role, type, startDate, endDate, feeCollected, feeAmount, comments } = employment;

  return (
    <ListItem alignItems="flex-start" disablePadding>
      <Box sx={{ flex: 1, minWidth: 0, paddingLeft: 2, paddingY: 1 }}>
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'baseline',
            columnGap: 1,
            paddingY: 1,
            overflowWrap: 'anywhere',
          }}
        >
          <Typography sx={{ fontWeight: 'bold' }}>{companyName}</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {role}
          </Typography>
        </Box>
        <Stack spacing={1} sx={{ paddingBottom: 1 }}>
          <Stack direction="row" sx={{ alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
            <Chip
              label={formatTextToFriendly(type)}
              size="small"
              variant="outlined"
              color={type === EmploymentType.Job ? 'info' : 'default'}
            />
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {formatDateForDisplay(startDate)} – {endDate ? formatDateForDisplay(endDate) : 'present'}
            </Typography>
          </Stack>
          {comments && (
            // Without the margin under the last paragraph, the comments end as far from the bottom as the other lines.
            <Typography
              variant="body2"
              component="div"
              sx={{ color: 'text.secondary', '& > * > :last-child': { marginBottom: 0 } }}
            >
              <MarkdownText>{comments}</MarkdownText>
            </Typography>
          )}
        </Stack>
      </Box>
      <Stack direction="row" sx={{ alignItems: 'center', gap: 1, paddingY: 1 }}>
        {feeCollected && (
          <Chip
            icon={<CheckIcon />}
            label={`Fee ${feeAmount !== null ? feeFormat.format(feeAmount) : 'collected'}`}
            size="small"
            color="success"
            variant="outlined"
          />
        )}
        <ListItemActions onEdit={onEdit} onDelete={onDelete} />
      </Stack>
    </ListItem>
  );
};

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
  if (employmentHistory.length === 0) {
    return (
      <Typography sx={{ color: 'text.secondary', paddingX: 2, paddingY: 3, bgcolor: 'background.paper' }}>
        No employment history yet
      </Typography>
    );
  }

  return (
    <List
      sx={{
        width: '100%',
        bgcolor: 'background.paper',
        maxHeight: 400,
        overflow: 'auto',
        scrollbarWidth: 'thin',
        '& > :nth-of-type(odd)': { bgcolor: 'background.paperAlt' },
      }}
    >
      {employmentHistory.map((employment) => (
        <EmploymentHistoryListItem
          key={employment.id}
          employment={employment}
          onEdit={() => onClickEdit(employment.id)}
          onDelete={() => onClickDelete(employment.id)}
        />
      ))}
    </List>
  );
};
