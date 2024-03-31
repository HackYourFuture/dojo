import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

export const Loader = () => {
  return (
    <Box sx={{ display: 'flex',width:'100%',height:'100%',alignItems:"center",justifyContent:"center",position:"absolute" }}>
      <CircularProgress size={80} />
    </Box>
  );
};



