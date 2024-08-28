import React, { useState } from 'react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { addTestCase } from '../../store/testCaseSlice'
import { styled } from '@mui/system'
import { selectFunctionNames } from '../../store/functionSlice'
import { v4 as uuidv4 } from 'uuid'
const StyledButton = styled(Button)(({ theme }) => ({
  width: 'auto', // Ensures the button doesn't take up too much space
  alignSelf: 'flex-end' // Aligns the button to the right
}))

export const CreateTestCasePopup: React.FC = () => {
  const [open, setOpen] = useState(false)
  const [inputFile, setInputFile] = useState<File | null>(null)
  const [outputFile, setOutputFile] = useState<File | null>(null)
  const [selectedFunction, setSelectedFunction] = useState<string>('')
  const dispatch = useDispatch()
  const functionNames = useSelector(selectFunctionNames)

  const handleCreate = () => {
    if (inputFile && selectedFunction) {
      dispatch(
        addTestCase({
          id: uuidv4(),
          inputFileName: inputFile.name,
          outputFileName: outputFile?.name || null,
          functionName: selectedFunction // Include the selected function
        })
      )
      setOpen(false)
      setInputFile(null)
      setOutputFile(null)
      setSelectedFunction('')
    } else {
      // Handle error - input file and function are required
    }
  }

  return (
    <>
      <Button
        variant='contained'
        onClick={() => {
          console.log('Button clicked')
          setOpen(true)
        }}
      >
        Create Test Case
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Create Test Case</DialogTitle>
        <DialogContent>
          <TextField
            type='file'
            onChange={(e) => {
              const target = e.target as HTMLInputElement
              setInputFile(target.files ? target.files[0] : null)
            }}
            label='Select Input File'
            InputLabelProps={{ shrink: true }}
            required
            fullWidth
            margin='dense'
          />
          <TextField
            type='file'
            onChange={(e) => {
              const target = e.target as HTMLInputElement
              setOutputFile(target.files ? target.files[0] : null)
            }}
            label='Select Output File (Optional)'
            InputLabelProps={{ shrink: true }}
            fullWidth
            margin='dense'
          />
          <FormControl fullWidth margin='dense' required>
            <InputLabel>Select Function</InputLabel>
            <Select value={selectedFunction} onChange={(e) => setSelectedFunction(e.target.value as string)}>
              {functionNames.map((fn) => (
                <MenuItem key={fn} value={fn}>
                  {fn}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleCreate} variant='contained'>
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
