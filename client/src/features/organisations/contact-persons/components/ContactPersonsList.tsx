import { List, Typography } from '@mui/material';

import { ContactPerson } from '../ContactPerson';
import { ContactPersonListItem } from './ContactPersonListItem';

interface ContactPersonsListProps {
  contactPersons: ContactPerson[];
  onClickEdit: (contactPerson: ContactPerson) => void;
  onClickDelete: (contactPerson: ContactPerson) => void;
}

/** The contact persons of an organisation, shaded every other one like the employment history. */
export const ContactPersonsList = ({ contactPersons, onClickEdit, onClickDelete }: ContactPersonsListProps) => {
  if (contactPersons.length === 0) {
    return (
      <Typography color="text.secondary" paddingX={2} paddingY={3} bgcolor="background.paper">
        No contacts yet
      </Typography>
    );
  }

  return (
    <List sx={{ bgcolor: 'background.paper', '& > :nth-of-type(odd)': { bgcolor: 'background.paperAlt' } }}>
      {contactPersons.map((contactPerson) => (
        <ContactPersonListItem
          key={contactPerson.id}
          contactPerson={contactPerson}
          onEdit={() => onClickEdit(contactPerson)}
          onDelete={() => onClickDelete(contactPerson)}
        />
      ))}
    </List>
  );
};
