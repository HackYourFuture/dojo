import { Typography, Button, Box } from '@mui/material';
import CommentImg from '../assets/comment.png';

// change later with real data

/**
 * Component for displaying comment section in the trainee profile page.
 * @returns {ReactNode} A React element that renders comment section view and logic.
 */
export const Comment = () => {
  return (
    <div>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#04966a',
          padding: '8px 16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img src={CommentImg} alt="Strike Icon" style={{ width: '28px', height: '32px', marginRight: '8px' }} />
          <Typography variant="h6" color="white">
            Comments
          </Typography>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Button
            variant="contained"
            color="inherit"
            style={{
              padding: '6px 24px',
              borderRadius: '9999px',
            }}
          >
            <Typography>+</Typography>
          </Button>
        </div>
      </Box>

      <div
        style={{
          backgroundColor: 'white',
          padding: '16px',
          borderTop: '2px dashed #ccc',
          borderBottom: '2px dashed #ccc',
          color: 'black',
        }}
      >
        {/* Giuseppina's comment */}
        <div
          style={{
            display: 'flex',
            alignItems: 'start',
            paddingBottom: '8px',
            marginBottom: '8px',
            borderBottom: '1px solid #ccc',
          }}
        >
          <div>
            <img
              src=""
              alt="Profile"
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                marginRight: '16px',
              }}
            />
          </div>
          <div style={{ marginLeft: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <Typography variant="h6">Giuseppina</Typography>
              <Typography variant="body2" color="gray">
                March 28, 2024
              </Typography>
            </div>
            <Typography variant="body1">This is a comment from Giuseppina.</Typography>
          </div>
        </div>

        {/* Josephine's comment */}
        <div
          style={{
            display: 'flex',
            alignItems: 'start',
            paddingBottom: '8px',
            marginBottom: '8px',
            borderBottom: '1px solid #ccc',
          }}
        >
          <div>
            <img
              src=""
              alt="Profile"
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                marginRight: '16px',
              }}
            />
          </div>
          <div style={{ marginLeft: '16px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '8px',
              }}
            >
              <Typography variant="h6">Josephine</Typography>
              <Typography variant="body2" color="gray">
                March 29, 2024
              </Typography>
            </div>
            <Typography variant="body1">This is another comment from Josephine.</Typography>
          </div>
        </div>
      </div>
    </div>
  );
};
