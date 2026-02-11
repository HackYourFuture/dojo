import { SxProps, Theme } from '@mui/material/styles';

import Button from '@mui/material/Button';
import React from 'react';

interface ButtonWithIconProps {
  text: string;
  startIcon?: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  isLoading?: boolean;
  sx?: SxProps<Theme>;
  type?: 'button' | 'submit' | 'reset';
}

export const ButtonWithIcon: React.FC<ButtonWithIconProps> = ({
  text,
  startIcon,
  onClick,
  sx,
  type = 'button',
  isLoading = false,
}) => (
  <Button variant="contained" startIcon={startIcon} onClick={onClick} sx={sx} type={type} loading={isLoading}>
    {text}
  </Button>
);
