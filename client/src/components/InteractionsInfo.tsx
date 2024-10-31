import { useState, useEffect } from 'react';
import { Avatar, Box, Button, Chip, TextField, Select, MenuItem, FormControl, InputLabel, Typography, List, ListItem } from '@mui/material';
import { TraineeInteraction, InteractionType } from '../models';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit'; 
//pen

// example of color
// <HomeIcon />
// <HomeIcon color="primary" />
// <HomeIcon color="secondary" />
// <HomeIcon color="success" />
// <HomeIcon color="action" />
// <HomeIcon color="disabled" />
// <HomeIcon sx={{ color: pink[500] }} />

// example of size
// <HomeIcon fontSize="small" />
// <HomeIcon />
// <HomeIcon fontSize="large" />
// <HomeIcon sx={{ fontSize: 40 }} />

export const InteractionsInfo = () => {
  const [interactions, setInteractions] = useState<TraineeInteraction[]>([]);
  
  // State for form fields
  const [date, setDate] = useState<Date>(new Date());
  const [type, setType] = useState<InteractionType | ''>('');  
  const [reporterID, setReporterID] = useState<string>('');
  const [details, setDetails] = useState<string>('');
  


  //TEST

  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    setFadeIn(true); // Trigger the fade-in effect when the component mounts
  }, []);

  // TEST END

  // Function to handle form submission
  const handleAddInteraction = async () => {
    const newInteraction: TraineeInteraction = {
      id: Date.now().toString(),         // Using a timestamp as a unique ID
      date: date,
      type: type,
      reporterID: reporterID,
      details: details,
    };


    //GET method !!!!!!!!!! //
    await sendInteractionToAPI(newInteraction);
    setInteractions((prevInteractions) => [...prevInteractions, newInteraction]);


    // Clear form fields after submission
    setDate(new Date());
    setType('');
    setReporterID('');
    setDetails('');
  };




  const sendInteractionToAPI = async (interaction: TraineeInteraction) => {
    try {
      const response = await fetch('/api/interactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(interaction),
      });
      if (!response.ok) throw new Error('Failed to send interaction');
      console.log("Interaction saved:", interaction);
    } catch (error) {
      console.error('Error sending interaction:', error);
    }
  };
  // Function to fetch interactions from the API
  const fetchInteractions = async () => {
    try {
      const response = await fetch('/api/interactions');
      if (!response.ok) throw new Error('Failed to fetch interactions');
      const data: TraineeInteraction[] = await response.json();
      setInteractions(data);
    } catch (error) {
      console.error('Error fetching interactions:', error);
    }
  };

  // Fetch interactions when component mounts
  useEffect(() => {
    fetchInteractions();
  }, []);

  return (
    <Box style={{}}>

      <Typography variant="h6">Add New Interaction</Typography>
      <Box>
<Box style={{display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center'}}>

    <Box style={{alignItems:'center', width:'85%'}}>
      <FormControl variant={'outlined'} style={{width:'18%', marginBottom:'15px', marginRight:'2%'}} >
        <InputLabel>Type</InputLabel>
        <Select label="Type" value={type} onChange={(e) => setType(e.target.value as InteractionType)}>
          <MenuItem value={InteractionType.Call}>Call</MenuItem>
          <MenuItem value={InteractionType.Chat}>Chat</MenuItem>
          <MenuItem value={InteractionType.Feedback}>Feedback</MenuItem>
          <MenuItem value={InteractionType.TechHour}>Tech Hour</MenuItem>
          <MenuItem value={InteractionType.InPerson}>In-person</MenuItem>
          <MenuItem value={InteractionType.Other}>Other</MenuItem>
        </Select>
      </FormControl>

     
      <FormControl variant={"outlined"} sx={{ marginBottom:'15px', width:'80%' }}>
           <TextField
            id="title"
            name="title"
            label="Title"
            type="text"
          />
  </FormControl >


  </Box>
<FormControl sx={{width: '85%' }}>
          <TextField
            id="details"
            name="details"
            label="Details"
            type="text"
            multiline
            rows={4}
            // value={editedFields?.details || ''}
            value={details} onChange={(e) => setDetails(e.target.value)}
            InputLabelProps={{ shrink: true }}
            variant={"outlined"}
            // onChange={handleChange}
          />
        </FormControl>



      {/* Submit Button */}
      <Box style={{display:'flex', justifyContent: 'flex-start', width:'85%', marginTop:"2%"}}>
      <Button variant="contained" color="primary" sx={{ width:'140px' }} style={{ marginTop:"2"}} onClick={handleAddInteraction}>
        Add Interaction
      </Button>
</Box>
      </Box> </Box>

      {/* List of interactions */}
   

      <Box style={{ color: 'black', display:'flex', justifyContent:'center', alignItems: 'center', flexDirection:'column'}}>

      <hr style={{width:'90%', marginTop:23, marginBottom:23}}></hr>

    <Box sx={{ width:'80%'}}>  
    {interactions.slice().reverse().map((interaction)=> (
            


            <Box key={interaction.id} sx={{mb:3}}> 
            <Box  sx={{ display: 'flex', justifyContent: 'flex-end'}}>
        <Typography variant="body2"> <strong>Date:</strong> {interaction.date.toLocaleDateString()}</Typography>
        {/* <Button variant="text">Text</Button>
        <Button variant="text">Text</Button> */}
        </Box>
        

        <Box sx={{ display:'flex', gap:'2%'}}>  
        <Box sx={{display:'flex'}}>    
    <Avatar
    alt="Remy Sharp"
    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQGljU55NVUxc4wjdqj2l8aC0Il8W8CKVcFUZc4A4pVXhjVIUhs-0oX9BJXLExwgE2R&usqp=CAU"
    sx={{ width: 52, height: 52, marginRight:0 }}
    />
    </Box>
    <Box sx={{ width: '100%', marginRight:5 }}>
    {/* Type and Title */}
    
    <Typography variant="body1" component="span" sx={{ display: 'block' }}>
    <Chip label={interaction.type} color="primary"/> &nbsp; <strong>Title</strong> {interaction.title}
    </Typography>
   

    {/* Details */}
    <Typography variant="body1" sx={{ marginTop: 1}}>
    {interaction.details}
    </Typography>
   
  </Box>

    </Box>

          </Box>
          
        ))}
      </Box>
      </Box>

    </Box>
  );
};

//  Loader component if loading show if not ..

//add interaction .
//request
//separate social part in another component
//deletion and edit
