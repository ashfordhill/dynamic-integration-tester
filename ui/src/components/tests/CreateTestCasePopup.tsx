import React, { useState } from 'react'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material'
import { useDispatch } from 'react-redux'
import { addTestCase } from '../../store/testCaseSlice'

const CreateTestCasePopup: React.FC = () => {
  const [open, setOpen] = useState(false)
  const [inputFile, setInputFile] = useState<File | null>(null)
  const [outputFile, setOutputFile] = useState<File | null>(null)
  const dispatch = useDispatch()

  const handleCreate = () => {
    if (inputFile) {
      dispatch(addTestCase({ inputFileName: inputFile.name, outputFileName: outputFile?.name || null }))
      setOpen(false)
      setInputFile(null)
      setOutputFile(null)
    } else {
      // Handle error - input file is required
    }
  }

  return (
    <>
      <Button variant='contained' onClick={() => setOpen(true)}>
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
              setInputFile(target.files ? target.files[0] : null)
            }}
            label='Select Output File (Optional)'
            InputLabelProps={{ shrink: true }}
            fullWidth
            margin='dense'
          />
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

export default CreateTestCasePopup
