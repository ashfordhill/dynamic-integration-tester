import React, { useEffect, useState } from 'react'
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, Box } from '@mui/material'
import { styled } from '@mui/system'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import MonacoEditorWrapper from './MonacoEditorWrapper'
import ImportButton from './ImportButton'
import EnvButton from './EnvButton'
import TransportButton from './TransportButton'
import {
  addFunction,
  selectEditorOpen,
  selectFunctionNames,
  setConsoleOutput,
  setEditorOpen
} from '../../../store/functionSlice'

const defaultScriptTemplate = `import sys
import logging

if __name__ == "__main__":
    sender_connection = json.loads(sys.argv[1])
    receiver_connection = json.loads(sys.argv[2])
    input_file = sys.argv[3]
    output_file = sys.argv[4]

    execute_test(sender_connection, receiver_connection, input_file, output_file)

def execute_test(connection_sender, connection_receiver, input_file, output_file):
    logging.debug("Starting test..")
`

// Styled Components
const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiPaper-root': {
    backgroundColor: '#1e1e1e',
    color: '#fff'
  }
}))

const StyledDialogTitle = styled(DialogTitle)({
  textAlign: 'center',
  color: '#fff'
})

const StyledTextField = styled(TextField)({
  backgroundColor: '#2c2c2c',
  color: '#fff',
  '& .MuiInputBase-input': {
    color: '#fff'
  },
  '& .MuiInputLabel-root': {
    color: '#bbb'
  }
})

const ButtonContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
  gap: '8px',
  marginBottom: '16px',
  marginTop: '16px'
})

export const FunctionEditor = () => {
  const dispatch = useDispatch()
  const editorOpen = useSelector(selectEditorOpen)
  const existingFns = useSelector(selectFunctionNames)
  const [args, setArgs] = useState('')
  const [functionName, setFunctionName] = useState('')
  const [script, setScript] = useState(defaultScriptTemplate)
  const [error, setError] = useState('')

  useEffect(() => {
    if (existingFns.includes(functionName)) {
      setError('Name is already taken')
    } else {
      setError('')
    }
  }, [functionName, existingFns])

  const handleSave = async () => {
    try {
      if (!error && functionName.trim() && script.trim()) {
        const response = await axios.post('/api/save-script', {
          name: functionName,
          script: script,
          args: args
        })
        dispatch(setConsoleOutput(JSON.stringify(response.data)))
        if (response.status === 200) {
          dispatch(
            addFunction({
              name: functionName,
              args: args.split(' ')
            })
          )
          setFunctionName('')
          setArgs('')
          setScript(defaultScriptTemplate)
          handleClose()
        } else {
          setError('Failed to save the function.')
        }
      }
    } catch (err) {
      setError(`Save failed: ${(err as Error).message}`)
    }
  }

  const handleClose = () => {
    dispatch(setEditorOpen(false))
  }

  const handleClear = () => {
    setScript('')
  }

  const handleReset = () => {
    setScript(defaultScriptTemplate)
  }

  const handleSelectImport = (importStatement: string) => {
    setScript((prevScript) => `${importStatement}\n${prevScript}`)
  }

  const handleSelectEnv = (envCode: string) => {
    setScript((prevScript) => `${prevScript}\n${envCode}`)
  }

  const handleSelectTransport = (importStatement: string, transportCode: string) => {
    setScript((prevScript) => `${importStatement}\n${prevScript}`)
    setScript((prevScript) => `${prevScript}\n${transportCode}`)
  }

  return (
    <StyledDialog open={editorOpen} onClose={handleClose} maxWidth='md' fullWidth>
      <StyledDialogTitle>Create New Function</StyledDialogTitle>
      <DialogContent>
        <StyledTextField
          label='Function Name'
          value={functionName}
          onChange={(e) => setFunctionName(e.target.value)}
          fullWidth
          margin='dense'
          error={!!error}
          helperText={error}
          variant='filled'
        />
        <ButtonContainer>
          <ImportButton onSelectImport={handleSelectImport} />
          <EnvButton onSelectEnv={handleSelectEnv} />
          <TransportButton onSelectTransport={handleSelectTransport} />
          <Button onClick={handleClear} variant='contained' color='error'>
            Clear
          </Button>
          <Button onClick={handleReset} variant='contained' color='error'>
            Reset to Default
          </Button>
        </ButtonContainer>
        <MonacoEditorWrapper script={script} setScript={setScript} height='400px' width='100%' language='python' />
        <StyledTextField
          label='Args (optional)'
          value={args}
          onChange={(e) => setArgs(e.target.value)}
          fullWidth
          helperText='Use a single space to separate multiple args'
          margin='normal'
          variant='filled'
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} sx={{ color: '#fff' }}>
          Cancel
        </Button>
        <Button onClick={handleSave} sx={{ color: '#3b82f6' }}>
          Save
        </Button>
      </DialogActions>
    </StyledDialog>
  )
}
