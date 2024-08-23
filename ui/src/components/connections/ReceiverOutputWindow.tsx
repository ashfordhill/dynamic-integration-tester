import React, { useState } from 'react';
import { Box, Button, TextareaAutosize } from '@mui/material';

const ReceiverOutputWindow: React.FC = () => {
  const [output, setOutput] = useState('');

  const handleSaveOutput = () => {
    // Logic to save output as a file
  };

  return (
    <Box>
      <TextareaAutosize
        value={output}
        onChange={(e) => setOutput(e.target.value)}
        minRows={6}
        placeholder="Receiver Connection Output..."
        style={{ width: '100%' }}
      />
      <Button onClick={handleSaveOutput} variant="contained" sx={{ marginTop: 2 }}>
        Save as File
      </Button>
    </Box>
  );
};

export default ReceiverOutputWindow;