import { Box, IconButton, ListItem, Stack, Typography } from '@mui/material';

import { ContactPerson } from '../ContactPerson';
import EmailIcon from '@mui/icons-material/EmailOutlined';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import { ListItemActions } from '../../../../components/ListItemActions';
import MarkdownText from '../../../trainee-profile/components/MarkdownText';
import PhoneIcon from '@mui/icons-material/Phone';
import { ReactNode } from 'react';

interface ContactDetailProps {
  label: string;
  href: string;
  icon: ReactNode;
  children: string;
}

// The email address or the phone number as text, after an icon that opens it in the mail or phone app.
const ContactDetail = ({ label, href, icon, children }: ContactDetailProps) => (
  <Stack direction="row" sx={{ alignItems: 'center', minWidth: 0 }}>
    <IconButton size="small" edge="start" aria-label={label} href={href}>
      {icon}
    </IconButton>
    <Typography variant="body2" sx={{ overflowWrap: 'anywhere' }}>
      {children}
    </Typography>
  </Stack>
);

interface ContactPersonListItemProps {
  contactPerson: ContactPerson;
  onEdit: () => void;
  onDelete: () => void;
}

/** A contact person: the name and job title on the first line, then the email and phone, and the notes. */
export const ContactPersonListItem = ({ contactPerson, onEdit, onDelete }: ContactPersonListItemProps) => {
  const { name, jobTitle, linkedinUrl, phone, email, notes } = contactPerson;

  return (
    <ListItem alignItems="flex-start" disablePadding>
      <Box sx={{ flex: 1, minWidth: 0, paddingLeft: 2, paddingY: 1 }}>
        {/* The job title wraps below the name as a whole. The padding lines the name up with the button icons. */}
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
          <Typography sx={{ fontWeight: 'bold' }}>{name}</Typography>
          {jobTitle && (
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {jobTitle}
            </Typography>
          )}
        </Box>
        {/* Left out without any details, so a contact with only a name has no extra space at the bottom. */}
        {(email || phone || notes) && (
          <Stack spacing={0.5} sx={{ paddingBottom: 1 }}>
            {(email || phone) && (
              <Stack direction="row" sx={{ alignItems: 'center', flexWrap: 'wrap', columnGap: 1 }}>
                {email && (
                  <ContactDetail label="Email" href={`mailto:${email}`} icon={<EmailIcon fontSize="small" />}>
                    {email}
                  </ContactDetail>
                )}
                {email && phone && (
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    •
                  </Typography>
                )}
                {phone && (
                  <ContactDetail label="Phone" href={`tel:${phone}`} icon={<PhoneIcon fontSize="small" />}>
                    {phone}
                  </ContactDetail>
                )}
              </Stack>
            )}
            {notes && (
              // Without the margin under the last paragraph, the notes end as far from the bottom as the other lines.
              <Typography
                variant="body2"
                component="div"
                sx={{ color: 'text.secondary', '& > * > :last-child': { marginBottom: 0 } }}
              >
                <MarkdownText>{notes}</MarkdownText>
              </Typography>
            )}
          </Stack>
        )}
      </Box>
      <Stack direction="row" sx={{ paddingY: 1 }}>
        {linkedinUrl && (
          <IconButton aria-label="LinkedIn" href={linkedinUrl} target="_blank" rel="noopener">
            <LinkedInIcon sx={{ color: 'action.active' }} />
          </IconButton>
        )}
        <ListItemActions onEdit={onEdit} onDelete={onDelete} />
      </Stack>
    </ListItem>
  );
};
