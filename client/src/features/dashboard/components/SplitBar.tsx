import { Box, Stack, Typography } from '@mui/material';

interface SplitPart {
  label: string;
  value: number;
  color: string;
}

interface SplitBarProps {
  parts: SplitPart[];
}

// A bar split into colored parts, with each part's number below it.
export const SplitBar = ({ parts }: SplitBarProps) => {
  const total = parts.reduce((sum, part) => sum + part.value, 0);

  return (
    <Box sx={{ mt: 1 }}>
      <Box sx={{ display: 'flex', height: 8, borderRadius: 4, overflow: 'hidden', bgcolor: 'action.hover' }}>
        {parts.map((part) => (
          <Box
            key={part.label}
            sx={{ width: `${total === 0 ? 0 : (part.value / total) * 100}%`, bgcolor: part.color }}
          />
        ))}
      </Box>
      <Stack direction="row" spacing={2} useFlexGap sx={{ mt: 1, flexWrap: 'wrap' }}>
        {parts.map((part) => (
          <Stack key={part.label} direction="row" spacing={0.75} sx={{ alignItems: 'center' }}>
            <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: part.color }} />
            <Typography variant="body2">
              <strong>{part.value}</strong> {part.label}
            </Typography>
          </Stack>
        ))}
      </Stack>
    </Box>
  );
};
