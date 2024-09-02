import { useDispatch, useSelector } from 'react-redux'
import { Box, Button, Typography, TextareaAutosize } from '@mui/material'
import {
  saveTestResult,
  selectLastExecuteTestResultId,
  selectReceiverOutputWindow
} from '../../store/testCaseSlice'
import { AppDispatch } from '../../store/store'

const ReceiverOutputWindow = () => {
  const dispatch = useDispatch<AppDispatch>()
  const lastExecutedTestResultId = useSelector(selectLastExecuteTestResultId) || ''
  const receiverOutput = useSelector(selectReceiverOutputWindow)

  const handleSaveOutput = () => {
    // Dispatch action to save the test result
    dispatch(saveTestResult(lastExecutedTestResultId))
  }

  return (
    <Box sx={{ width: '100%', maxWidth: '800px', margin: '0 auto', mt: 4 }}>
      <Box display='flex' justifyContent='space-between' alignItems='center' mb={2}>
        <Typography variant='h6'>Receiver Connection Output</Typography>
      </Box>
      <Box>
        <TextareaAutosize
          value={receiverOutput}
          minRows={4}
          disabled={true}
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
        <Button onClick={handleSaveOutput} variant='contained' disabled={!receiverOutput}>
          Save as Expected Output
        </Button>
      </Box>
    </Box>
  )
}

export default ReceiverOutputWindow
