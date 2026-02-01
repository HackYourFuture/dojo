import { Box, FormControl, Icon, InputAdornment, Link, TextField, Typography } from '@mui/material';

import ContactEmergencyIcon from '@mui/icons-material/ContactEmergency';
import EmailIcon from '@mui/icons-material/EmailOutlined';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkIcon from '@mui/icons-material/Link';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import PhoneIcon from '@mui/icons-material/Phone';
import { createTextChangeHandler } from '../utils/formHelper';
import slackIcon from '../../../assets/slack.png';
import { useTraineeProfileContext } from '../context/useTraineeProfileContext';

/**
 * Component for displaying contact information in trainee profile data on the contact tab.
 *
 * @returns {ReactNode} A React element that renders trainee contact information with view, add, and edit logic.
 */
const ContactInfo = () => {
  const { trainee, setTrainee, isEditMode: isEditing } = useTraineeProfileContext();

  const { contactInfo: editedFields } = trainee;

  const handleTextChange = createTextChangeHandler(setTrainee, 'contactInfo');

  return (
    <Box display="flex" flexWrap="wrap" gap={4} padding="24px">
      <Box width="90ch" display="flex">
        <Box width="50%">
          {/* Email */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <EmailIcon sx={{ color: 'action.active', mr: 1 }} />
            <FormControl
              sx={{
                mx: 2,
                my: 2,
                width: '100%',
                gap: '2rem',
              }}
            >
              <TextField
                id="email"
                name="email"
                label="Email"
                type="email"
                value={editedFields.email || ''}
                InputProps={{
                  readOnly: isEditing ? false : true,
                  endAdornment: (
                    <InputAdornment position="start">
                      {!isEditing && editedFields.email && (
                        <Link href={'mailto:' + editedFields.email}>
                          <LinkIcon sx={{ color: 'action.active' }} />
                        </Link>
                      )}
                    </InputAdornment>
                  ),
                }}
                InputLabelProps={{
                  shrink: true,
                }}
                variant={isEditing ? 'outlined' : 'standard'}
                onChange={handleTextChange}
              />
            </FormControl>
          </Box>

          {/* Slack */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Icon sx={{ mr: 1 }}>
              <img src={slackIcon} alt="Slack" width="27" height="27" />
            </Icon>
            <FormControl
              sx={{
                mx: 2,
                my: 2,
                width: '100%',
                gap: '2rem',
              }}
            >
              <TextField
                id="slackId"
                name="slackId"
                label="Slack ID"
                type="text"
                placeholder="Format: UXXXXXXXXXX"
                value={editedFields.slackId || ''}
                InputProps={{
                  readOnly: isEditing ? false : true,
                  endAdornment: (
                    <InputAdornment position="start">
                      {!isEditing && editedFields.slackId && (
                        <Link href={`slack://user?team=T0EJTUQ87&id=${editedFields.slackId}`}>
                          <LinkIcon sx={{ color: 'action.active' }} />
                        </Link>
                      )}
                    </InputAdornment>
                  ),
                }}
                InputLabelProps={{
                  shrink: true,
                }}
                variant={isEditing ? 'outlined' : 'standard'}
                onChange={handleTextChange}
              />
            </FormControl>
          </Box>
        </Box>

        <Box width="50%">
          {/* Phone */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <PhoneIcon sx={{ color: 'action.active', mr: 1 }} />
            <FormControl
              sx={{
                mx: 2,
                my: 2,
                width: '100%',
                gap: '2rem',
              }}
            >
              <TextField
                id="phone"
                name="phone"
                label="Phone"
                type="tel"
                value={editedFields.phone || ''}
                InputProps={{
                  readOnly: isEditing ? false : true,
                }}
                InputLabelProps={{
                  shrink: true,
                }}
                variant={isEditing ? 'outlined' : 'standard'}
                onChange={handleTextChange}
              />
            </FormControl>
          </Box>

          {/* Github Handle */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <GitHubIcon sx={{ color: 'action.active', mr: 1 }} />
            <FormControl
              sx={{
                mx: 2,
                my: 2,
                width: '100%',
                gap: '2rem',
              }}
            >
              <TextField
                id="githubHandle"
                name="githubHandle"
                label="Github Handle"
                type="text"
                value={editedFields.githubHandle || ''}
                InputProps={{
                  readOnly: isEditing ? false : true,
                  endAdornment: (
                    <InputAdornment position="start">
                      {!isEditing && editedFields.githubHandle && (
                        <Link href={'https://github.com/' + editedFields.githubHandle} target="_blank">
                          <LinkIcon sx={{ color: 'action.active' }} />
                        </Link>
                      )}
                    </InputAdornment>
                  ),
                }}
                InputLabelProps={{
                  shrink: true,
                }}
                variant={isEditing ? 'outlined' : 'standard'}
                onChange={handleTextChange}
              />
            </FormControl>
          </Box>
        </Box>
      </Box>

      {/* Linkedin */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          width: '90ch',
        }}
      >
        <LinkedInIcon sx={{ color: 'action.active', mr: 1 }} />
        <FormControl
          sx={{
            mx: 2,
            my: 2,
            width: '100%',
            gap: '2rem',
          }}
        >
          <TextField
            id="linkedin"
            name="linkedin"
            label="Linkedin"
            type="url"
            value={editedFields.linkedin || ''}
            InputProps={{
              readOnly: isEditing ? false : true,
              endAdornment: (
                <InputAdornment position="start">
                  {!isEditing && editedFields.linkedin && (
                    <Link href={editedFields.linkedin} target="_blank">
                      <LinkIcon sx={{ color: 'action.active' }} />
                    </Link>
                  )}
                </InputAdornment>
              ),
            }}
            InputLabelProps={{
              shrink: true,
            }}
            variant={isEditing ? 'outlined' : 'standard'}
            onChange={handleTextChange}
          />
        </FormControl>
      </Box>

      <Typography variant="h6" color="black" padding="5px" width="100%">
        Emergency contact
      </Typography>

      <Box width="90ch" display="flex">
        <Box width="50%">
          {/* Emergency Contact */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <ContactEmergencyIcon sx={{ color: 'action.active', mr: 1 }} />
            <FormControl
              sx={{
                mx: 2,
                my: 2,
                width: '100%',
                gap: '2rem',
              }}
            >
              <TextField
                id="emergencyContactName"
                name="emergencyContactName"
                label="Emergency Contact"
                type="text"
                value={editedFields.emergencyContactName || ''}
                InputProps={{
                  readOnly: isEditing ? false : true,
                }}
                InputLabelProps={{
                  shrink: true,
                }}
                variant={isEditing ? 'outlined' : 'standard'}
                onChange={handleTextChange}
              />
            </FormControl>
          </Box>
        </Box>

        <Box width="50%">
          {/* Emergency Contact Phone */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <PhoneIcon sx={{ color: 'action.active', mr: 1 }} />
            <FormControl
              sx={{
                mx: 2,
                my: 2,
                width: '100%',
                gap: '2rem',
              }}
            >
              <TextField
                id="emergencyContactPhoneNum"
                name="emergencyContactPhoneNum"
                label="Emergency Contact Phone Number"
                type="tel"
                value={editedFields.emergencyContactPhoneNum || ''}
                InputProps={{
                  readOnly: isEditing ? false : true,
                }}
                InputLabelProps={{
                  shrink: true,
                }}
                variant={isEditing ? 'outlined' : 'standard'}
                onChange={handleTextChange}
              />
            </FormControl>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ContactInfo;
