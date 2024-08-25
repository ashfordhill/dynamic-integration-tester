import React, { useState } from 'react'
import { Box, Button, TextareaAutosize } from '@mui/material'

const ReceiverOutputWindow: React.FC = () => {
  const [output, setOutput] = useState('')

  const handleSaveOutput = () => {
    // Logic to save output as a file
  }

  return (
    <Box>
      <TextareaAutosize
        value={output}
        onChange={(e) => setOutput(e.target.value)}
        minRows={1}
        placeholder='Receiver Connection Output...'
        style={{
          width: '100%',
          backgroundColor: '#333', // Dark grey background
          color: '#fff', // White text color
          border: '1px solid #555', // Dark grey border
          borderRadius: '4px', // Optional: Add border radius for smoother corners
          padding: '8px' // Optional: Add padding for better text spacing
        }}
      />
      <Button onClick={handleSaveOutput} variant='contained' sx={{ marginTop: 2 }}>
        Save as File
      </Button>
    </Box>
  )
}

export default ReceiverOutputWindow
