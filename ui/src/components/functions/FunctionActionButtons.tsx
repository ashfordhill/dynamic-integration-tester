import { Button, Box } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { selectSelectedFunctionName, removeFunction, setConsoleOutput, setEditorOpen } from '../../store/functionsSlice'
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
      dispatch(setConsoleOutput(JSON.stringify(response.data)))
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
