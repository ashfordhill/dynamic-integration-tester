import React from 'react';
import { Paper, Typography, Box } from '@mui/material';

interface OutputWindowProps {
  output: string;
}

export const OutputWindow: React.FC<OutputWindowProps> = ({ output }) => {
  return (
    <Paper variant="outlined" sx={{ padding: 2, height: 200, overflowY: 'scroll' }}>
      <Typography variant="h6">Command Output</Typography>
      <Box component="pre" sx={{ margin: 0 }}>
        {output}
      </Box>
    </Paper>
  );
};