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
import { selectFunctionNames } from '../../store/functionSlice'
import { v4 as uuidv4 } from 'uuid'
import axios from 'axios'

export const CreateTestCasePopup: React.FC = () => {
  const [open, setOpen] = useState(false)
  const [inputFile, setInputFile] = useState<File | null>(null)
  const [outputFile, setOutputFile] = useState<File | null>(null)
  const [selectedFunction, setSelectedFunction] = useState<string>('')
  const dispatch = useDispatch()
  const functionNames = useSelector(selectFunctionNames)

  const handleCreate = () => {
    if (inputFile && selectedFunction) {
      const formData = new FormData()
      formData.append('inputFile', inputFile)
      if (outputFile) {
        formData.append('outputFile', outputFile)
      }
      formData.append('functionName', selectedFunction)

      // Make an API call to upload the files and create the test case
      axios
        .post('/api/upload-test-case-resources', formData)
        .then((response) => {
          dispatch(
            addTestCase({
              id: response.data.testCaseId, // Returned from the backend
              inputFileName: response.data.inputFileName,
              outputFileName: response.data.outputFileName || null,
              functionName: selectedFunction,
              testResultIds: []
            })
          )
          setOpen(false)
          setInputFile(null)
          setOutputFile(null)
          setSelectedFunction('')
        })
        .catch((error) => {
          console.error('Error uploading test case:', error)
          // Handle error appropriately
        })
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
