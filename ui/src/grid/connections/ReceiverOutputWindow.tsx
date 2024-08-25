import React, { useState } from 'react'
import { Box, Button, Typography, TextareaAutosize } from '@mui/material'

const ReceiverOutputWindow: React.FC = () => {
  const [output, setOutput] = useState('')

  const handleSaveOutput = () => {
    // Logic to save output as a file
  }

  return (
    <Box sx={{ width: '100%', maxWidth: '800px', margin: '0 auto', mt: 4 }}>
      <Box display='flex' justifyContent='space-between' alignItems='center' mb={2}>
        <Typography variant='h6'>Receiver Connection Output</Typography>
      </Box>
      <Box>
        <TextareaAutosize
          value={output}
          onChange={(e) => setOutput(e.target.value)}
          minRows={4}
          placeholder='Receiver Connection Output...'
          style={{
            width: '100%',
            minWidth: '800px',
            backgroundColor: '#333',
            color: '#fff',
            border: '1px solid #555',
            borderRadius: '4px',
            padding: '8px',
            boxSizing: 'border-box'
          }}
        />
      </Box>
      <Box display='flex' justifyContent='flex-end' mt={2}>
        <Button onClick={handleSaveOutput} variant='contained'>
          Save as Expected Output
        </Button>
      </Box>
    </Box>
  )
}

export default ReceiverOutputWindow
