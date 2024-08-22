import { useEffect, useState } from 'react'
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
} from '../../../store/functionsSlice'

const INPUTS_DIRECTORY = '/app/out/uploads/inputs'
const OUTPUTS_DIRECTORY = '/app/out/uploads/outputs'

const defaultScriptTemplate = ``

// Styled Components using MUI's `styled` utility
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
        const response = await axios.post('/api/save-script', { name: functionName, script: script, args: args })
        dispatch(setConsoleOutput(JSON.stringify(response.data)))
        if (response.status === 200) {
          dispatch(addFunction({ name: functionName, args: args.split(' ') }))
          setFunctionName('')
          setArgs('')
          setScript(defaultScriptTemplate) // Reset script to the default template
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

  const handleSelectImport = (importStatement: string) => {
    setScript((prevScript) => `${importStatement}\n${prevScript}`)
  }

  const handleSelectEnv = (envCode: string) => {
    setScript((prevScript) => `${prevScript}\n${envCode}`)
  }

  const handleSelectTransport = (importStatement: string, transportCode: string) => {
    // Insert the import statement at the top
    setScript((prevScript) => `${importStatement}\n${prevScript}`)
    // Insert the transport code at the current position
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
        </ButtonContainer>
        <MonacoEditorWrapper script={script} setScript={setScript} height='400px' width='100%' language='python' />
        <StyledTextField
          label='Args (optional)'
          value={args}
          onChange={(e) => setArgs(e.target.value)}
          fullWidth
          helperText='use a single space to separate multiple args'
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
