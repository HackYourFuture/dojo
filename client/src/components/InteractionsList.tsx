import { Avatar, Box, Chip, Typography } from '@mui/material';
import { TraineeInteraction } from '../models';

interface InteractionsListProps {
  interactions: TraineeInteraction[];
}

export const InteractionsList = ({ interactions }: InteractionsListProps) => {
  return (
    <Box sx={{ width: '80%', margin: '0 auto' }}>
      <hr style={{ width: '90%', margin: '23px auto' }} />
      {interactions
        .slice()
        .reverse()
        .map((interaction) => (
          <Box key={interaction.id} sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Typography variant="body2">
                <strong>Date:</strong> {new Date(interaction.date).toLocaleDateString()}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: '2%' }}>
              <Avatar
                alt="image"
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQGljU55NVUxc4wjdqj2l8aC0Il8W8CKVcFUZc4A4pVXhjVIUhs-0oX9BJXLExwgE2R&usqp=CAU"
                sx={{ width: 52, height: 52 }}
              />
              <Box sx={{ width: '100%' }}>
                <Typography variant="body1" component="span">
                  <Chip label={interaction.type} color="primary" /> &nbsp; <strong>{interaction.title}</strong>
                </Typography>
                <Typography variant="body1" sx={{ marginTop: 1 }}>
                  {interaction.details}
                </Typography>
              </Box>
            </Box>
          </Box>
        ))}
    </Box>
  );
};
