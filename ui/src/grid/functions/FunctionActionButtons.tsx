import { Button, Box } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { selectSelectedFunctionName, removeFunction, setConsoleOutput, setEditorOpen } from '../../store/functionSlice'
import axios from 'axios'

export const FunctionActionButtons = () => {
  const selectedFunction = useSelector(selectSelectedFunctionName)
  const dispatch = useDispatch()

  const handleEdit = () => {
    if (selectedFunction) {
      dispatch(setEditorOpen(true))
    }
  }

  const handleRemove = () => {
    if (selectedFunction) {
      dispatch(removeFunction(selectedFunction))
    }
  }

  const handleExecuteFunction = async () => {
    if (selectedFunction) {
      const response = await axios.post('/api/execute-script', { name: selectedFunction })
      const formattedOutput = response.data.output
        .replace(/\\n/g, '\n') // Replace literal \n with actual newline characters
        .replace(/\\(?!n)/g, '\\\\') // Escape other backslashes properly
        .replace(/'/g, '"')
      dispatch(setConsoleOutput(formattedOutput))
    }
  }

  return (
    <Box mt={2}>
      <Button variant='contained' color='primary' fullWidth onClick={handleEdit} disabled={!selectedFunction}>
        Edit
      </Button>
      <Button variant='contained' color='secondary' fullWidth onClick={handleRemove} disabled={!selectedFunction}>
        Remove
      </Button>
      <Button
        variant='contained'
        color='success'
        fullWidth
        onClick={handleExecuteFunction}
        disabled={!selectedFunction}
      >
        Execute Function
      </Button>
    </Box>
  )
}
