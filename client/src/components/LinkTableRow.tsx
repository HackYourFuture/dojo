import { MouseEvent, ReactNode } from 'react';
import { TableCell, TableRow } from '@mui/material';

import { useNavigate } from 'react-router';

interface LinkTableRowProps {
  to: string;
  children: ReactNode;
}

/** A table row that opens a page when it is clicked. */
export const LinkTableRow = ({ to, children }: LinkTableRowProps) => {
  const navigate = useNavigate();

  // Cmd, Ctrl or Shift opens the page in a new tab, as with a link.
  const handleClick = (event: MouseEvent) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey) {
      window.open(to, '_blank');
      return;
    }
    navigate(to);
  };

  // The middle button opens the page in a new tab too. Other buttons, like the right one, do nothing.
  const handleAuxClick = (event: MouseEvent) => {
    if (event.button === 1) {
      window.open(to, '_blank');
    }
  };

  return (
    // A link as the row would put an <a> in the <tbody>, so the row navigates on click instead.
    <TableRow
      hover
      onClick={handleClick}
      onAuxClick={handleAuxClick}
      sx={{ '&:last-child td, &:last-child th': { border: 0 }, cursor: 'pointer' }}
    >
      {children}
    </TableRow>
  );
};

/** The last cell of a LinkTableRow, with the row's own links, which do not open the row's page. */
export const RowLinksCell = ({ children }: { children: ReactNode }) => (
  <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'end' }} onClick={(event) => event.stopPropagation()}>
    {children}
  </TableCell>
);
