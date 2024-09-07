/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Button, FormControl, Icon, InputAdornment, Link, Stack, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import EmailIcon from '@mui/icons-material/EmailOutlined';
import PhoneIcon from '@mui/icons-material/Phone';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import LinkIcon from '@mui/icons-material/Link';
import slackIcon from '../assets/slack.png';
import { LoadingButton } from '@mui/lab';
import { TraineeContactInfo } from '../models';

interface ContactInfoProps {
  contactData?: TraineeContactInfo;
  saveTraineeData: (editedData: TraineeContactInfo) => void;
}

/**
 * Component for displaying contact information in trainee profile data on the contact tab.
 *
 * @param {TraineeContactInfo} contactData trainee contact information.
 * @param {TraineeContactInfo} saveTraineeData callback to save edited trainee contact information.
 * @returns {ReactNode} A React element that renders trainee contact information with view, add, and edit logic.
 */
export const ContactInfo = ({ contactData, saveTraineeData }: ContactInfoProps) => {
  const [editedFields, setEditedFields] = useState<TraineeContactInfo>(contactData!);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (contactData) setEditedFields(contactData as TraineeContactInfo);
  }, [contactData]);

  /**
   * Function to enable edit mode when edit button is clicked.
   */
  const handleEditClick = () => {
    setIsEditing(true);
  };

  /**
   * Function to set editing mode to `false` when cancel button is clicked.
   */
  const handleCancelClick = () => {
    if (contactData) {
      setEditedFields(contactData);
    }
    setIsEditing(false);
  };

  /**
   * Function to handel the saving logic after clicking the save button.
   */
  const handleSaveClick = async () => {
    if (!editedFields || !contactData) return;

    const changedFields: Partial<TraineeContactInfo> = {};
    Object.entries(editedFields).forEach(([key, value]) => {
      if (contactData[key as keyof TraineeContactInfo] !== value) {
        changedFields[key as keyof TraineeContactInfo] = value;
      }
    });

    const editedData: any = {
      contactInfo: {
        ...changedFields,
      },
    };

    setIsSaving(true);

    try {
      await saveTraineeData(editedData);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving trainee data:', error);
    } finally {
      setIsSaving(false);
    }
  };

  /**
   * Function to handel changing text fields with edited data.
   *
   * @param {HTMLInputElement} e the event received from the text fields after editing.
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedFields((prevFields) => ({
      ...prevFields,
      [name]: value,
    }));
  };

  return (
    <Box display="flex" flexDirection="column" gap={4} padding="24px">
      <Box width={'100%'} display="flex" justifyContent={'end'}>
        <Stack direction="row" spacing={2}>
          <LoadingButton
            color="primary"
            onClick={isEditing ? handleSaveClick : handleEditClick}
            loading={isSaving}
            variant="contained"
          >
            <span>{isEditing ? 'Save' : 'Edit profile'}</span>
          </LoadingButton>
          {isEditing && <Button onClick={handleCancelClick}>Cancel</Button>}
        </Stack>
      </Box>
      <div style={{ width: '100%' }}>
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
              width: '80ch',
              gap: '2rem',
            }}
          >
            <TextField
              id="email"
              name="email"
              label="Email"
              type="email"
              value={editedFields?.email || ''}
              InputProps={{
                readOnly: isEditing ? false : true,
                endAdornment: (
                  <InputAdornment position="start">
                    {!isEditing && editedFields?.email && (
                      <Link href={'mailto:' + editedFields?.email}>
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
              onChange={handleChange}
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
              width: '80ch',
              gap: '2rem',
            }}
          >
            <TextField
              id="slackId"
              name="slackId"
              label="Slack ID"
              type="text"
              placeholder="Format: UXXXXXXXXXX"
              value={editedFields?.slackId || ''}
              InputProps={{
                readOnly: isEditing ? false : true,
                endAdornment: (
                  <InputAdornment position="start">
                    {!isEditing && editedFields?.slackId && (
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
              onChange={handleChange}
            />
          </FormControl>
        </Box>

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
              width: '80ch',
              gap: '2rem',
            }}
          >
            <TextField
              id="phone"
              name="phone"
              label="Phone"
              type="tel"
              value={editedFields?.phone || ''}
              InputProps={{
                readOnly: isEditing ? false : true,
              }}
              InputLabelProps={{
                shrink: true,
              }}
              variant={isEditing ? 'outlined' : 'standard'}
              onChange={handleChange}
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
              width: '80ch',
              gap: '2rem',
            }}
          >
            <TextField
              id="githubHandle"
              name="githubHandle"
              label="Github Handle"
              type="text"
              value={editedFields?.githubHandle || ''}
              InputProps={{
                readOnly: isEditing ? false : true,
                endAdornment: (
                  <InputAdornment position="start">
                    {!isEditing && editedFields?.githubHandle && (
                      <Link href={'https://github.com/' + editedFields?.githubHandle} target="_blank">
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
              onChange={handleChange}
            />
          </FormControl>
        </Box>

        {/* Linkedin */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <LinkedInIcon sx={{ color: 'action.active', mr: 1 }} />
          <FormControl
            sx={{
              mx: 2,
              my: 2,
              width: '80ch',
              gap: '2rem',
            }}
          >
            <TextField
              id="linkedin"
              name="linkedin"
              label="Linkedin"
              type="url"
              value={editedFields?.linkedin || ''}
              InputProps={{
                readOnly: isEditing ? false : true,
                endAdornment: (
                  <InputAdornment position="start">
                    {!isEditing && editedFields?.linkedin && (
                      <Link href={editedFields?.linkedin} target="_blank">
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
              onChange={handleChange}
            />
          </FormControl>
        </Box>
      </div>
    </Box>
  );
};
