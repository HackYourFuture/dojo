// import { useState } from 'react';
// import {
//   Box,
//   Button,
//   TextField,
//   Select,
//   MenuItem,
//   FormControl,
//   InputLabel,
//   Typography,
// } from '@mui/material';
// import { grey } from '@mui/material/colors';
// import { InteractionType, TraineeInteraction } from '../models';
// import { useFetchInteractions } from '../hooks/useInteractionsData';
// import { useAddInteraction } from '../hooks/useAddInteraction';
// import { InteractionsList } from './InteractionsList';

// interface InteractionsInfoProps {
//   traineeId?: string;
// }

// export const InteractionsInfo = ({ traineeId }: InteractionsInfoProps) => {
//   const [date, setDate] = useState<Date>(new Date());
//   const [type, setType] = useState<InteractionType | null>(null);
//   const [reporterID, setReporterID] = useState<string>('');
//   const [details, setDetails] = useState<string>('');
//   const [title, setTitle] = useState<string>('');

//   const { data: interactions = [], isLoading, isError } = useFetchInteractions(traineeId);
//   const { mutate: addInteraction } = useAddInteraction(traineeId);

//   const validateFields = () => {
//     if (!type && !details) {
//       alert('Please add type and details.');
//       return false;
//     } else if (!type) {
//       alert('Please add type.');
//       return false;
//     } else if (!details) {
//       alert('Please add details.');
//       return false;
//     }
//     return true;
//   };

//   const handleAddInteraction = () => {
//     if (!validateFields()) return;

//     const newInteraction: TraineeInteraction = {
//       id: Date.now().toString(),
//       date: date,
//       type: type!,
//       title: title,
//       reporterID: reporterID,
//       details: details,
//     };

//     // Use the mutation to add the interaction
//     addInteraction(newInteraction, {
//       onSuccess: () => {
//         // Reset form on successful mutation
//         setDate(new Date());
//         setType(null);
//         setReporterID('');
//         setDetails('');
//         setTitle('');
//       },
//       onError: (error:any) => {
//         alert('Error adding interaction: ' + error);
//       },
//     });
//   };

//   if (isLoading) return <Typography>Loading interactions...</Typography>;
//   if (isError) return <Typography>Error loading interactions.</Typography>;

//   return (
//     <Box>
//       <Typography sx={{ color: grey['A700'], m: '30px 0 30px 7.5%' }}>Add New Interaction</Typography>
//       <Box style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
//         <Box style={{ width: '85%' }}>
//           <FormControl style={{ width: '18%', marginBottom: '15px', marginRight: '2%' }}>
//             <InputLabel>Type</InputLabel>
//             <Select
//               label="Type"
//               value={type || ''}
//               onChange={(e) => setType(e.target.value as InteractionType)}
//             >
//               <MenuItem value={InteractionType.Call}>Call</MenuItem>
//               <MenuItem value={InteractionType.Chat}>Chat</MenuItem>
//               <MenuItem value={InteractionType.Feedback}>Feedback</MenuItem>
//               <MenuItem value={InteractionType.TechHour}>Tech Hour</MenuItem>
//               <MenuItem value={InteractionType.InPerson}>In-person</MenuItem>
//               <MenuItem value={InteractionType.Other}>Other</MenuItem>
//             </Select>
//           </FormControl>

//           <FormControl sx={{ marginBottom: '15px', width: '80%' }}>
//             <TextField
//               id="title"
//               label="Title"
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//             />
//           </FormControl>
//         </Box>
//         <FormControl sx={{ width: '85%' }}>
//           <TextField
//             id="details"
//             label="Details"
//             multiline
//             minRows={4}
//             maxRows={10}
//             value={details}
//             onChange={(e) => setDetails(e.target.value)}
//           />
//         </FormControl>

//         <Box style={{ width: '85%', marginTop: '2%' }}>
//           <Button variant="contained" onClick={handleAddInteraction}>
//             Add Interaction
//           </Button>
//         </Box>
//       </Box>

//       <InteractionsList interactions={interactions} />
//     </Box>
//   );
// };
import { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  Avatar,
  Chip,
} from '@mui/material';
import { grey } from '@mui/material/colors';
import { InteractionType, TraineeInteraction } from '../models';
import { useFetchInteractions } from '../hooks/useInteractionsData';
import { useAddInteraction } from '../hooks/useAddInteraction';

interface InteractionsListProps {
  interactions: TraineeInteraction[];
}

export const InteractionsList = ({ interactions }: InteractionsListProps) => {
  //mock data
  const mockInteractions: TraineeInteraction[] = [
    {
      id: '1',
      date: new Date(),
      type: InteractionType.Call,
      title: 'Weekly Check-In',
      reporter: {
        name: 'John Doe',
        imageUrl: 'https://example.com/avatar1.jpg', 
      },
      details: 'Discussed progress and blockers.',
    },
    {
      id: '2',
      date: new Date(),
      type: InteractionType.Feedback,
      title: 'Code Review',
      reporter: {
        name: 'Jane Smith',
        imageUrl: 'https://example.com/avatar2.jpg',
      },
      details: 'Reviewed the submitted code assignment.',
    },
  ];
// use mock interactions
  const validInteractions = Array.isArray(interactions) && interactions.length > 0
    ? interactions
    : mockInteractions;

  console.log('InteractionsList rendering with:', validInteractions);

  return (
    <Box sx={{ width: '80%', margin: '0 auto' }}>
      <hr style={{ width: '90%', margin: '23px auto' }} />
      {validInteractions
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
                alt="avatar"
                src={interaction.reporter.imageUrl}
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

interface InteractionsInfoProps {
  traineeId?: string;
}

export const InteractionsInfo = ({ traineeId }: InteractionsInfoProps) => {


  // Fetch interactions for a trainee
  const { data: interactions = [], isLoading, isError } = useFetchInteractions(traineeId);

  // Fallback to empty array if interactions is undefined or falsy
  const validInteractions: TraineeInteraction[] = Array.isArray(interactions) && interactions.length > 0
    ? interactions
    : [];

  if (isLoading) return <Typography>Loading interactions...</Typography>;
  if (isError) return <Typography>Error loading interactions.</Typography>;

  return (
    <Box>

      <InteractionsList interactions={validInteractions} />
    </Box>
  );
};
