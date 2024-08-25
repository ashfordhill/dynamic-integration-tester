import { Select, MenuItem, Box } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import {
  selectFunctionNames,
  selectSelectedFunctionName,
  setEditorOpen,
  setSelectedFunction
} from '../../store/functionSlice'
import { FunctionEditor } from './editor/FunctionEditor'

const newFunction = 'new-function'
export const FunctionDropdown = () => {
  const dispatch = useDispatch()
  const functions = useSelector(selectFunctionNames)
  const selectedFunction = useSelector(selectSelectedFunctionName)

  const handleFunctionChange = (event: any) => {
    const functionName = event.target.value
    if (functionName === newFunction) {
      dispatch(setEditorOpen(true)) // Open the editor if "Create New Function..." is selected
    } else {
      dispatch(setSelectedFunction(functionName))
    }
  }

  return (
    <Box>
      <Select labelId='function-select-label' value={selectedFunction || ''} onChange={handleFunctionChange} fullWidth>
        {functions.map((func, index) => (
          <MenuItem key={index} value={func}>
            {func}
          </MenuItem>
        ))}
        <MenuItem value={newFunction}>Create New Function...</MenuItem>
      </Select>

      <FunctionEditor />
    </Box>
  )
}
