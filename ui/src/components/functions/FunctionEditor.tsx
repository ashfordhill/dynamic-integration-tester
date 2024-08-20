import { useEffect, useState } from 'react'
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField } from '@mui/material'
import MonacoEditor from 'react-monaco-editor'
import { useDispatch, useSelector } from 'react-redux'
import {
  addFunction,
  selectEditorOpen,
  selectFunctionNames,
  setConsoleOutput,
  setEditorOpen
} from '../../store/functionsSlice'
import axios from 'axios'

export const FunctionEditor = () => {
  const dispatch = useDispatch()
  const editorOpen = useSelector(selectEditorOpen)
  const existingFns = useSelector(selectFunctionNames)
  const [args, setArgs] = useState('')
  const [functionName, setFunctionName] = useState('')
  const [script, setScript] = useState('')
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
          dispatch(addFunction({ name: functionName, scriptContent: script }))
          setFunctionName('')
          setArgs('')
          setScript('')
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

  return (
    <Dialog open={editorOpen} onClose={handleClose}>
      <DialogTitle>Create New Function</DialogTitle>
      <DialogContent>
        <TextField
          label='Function Name'
          value={functionName}
          onChange={(e) => setFunctionName(e.target.value)}
          fullWidth
          margin='normal'
          error={!!error}
          helperText={error}
        />
        <MonacoEditor
          value={script}
          onChange={setScript}
          theme={'vs-dark'}
          language='python'
          height='400px'
          width='500px'
          options={{
            lineNumbers: 'on',
            autoIndent: 'advanced',
            language: 'python',
            scrollbar: { vertical: 'hidden', verticalScrollbarSize: 5 }
          }}
        />
        <TextField
          label='Args (optional)'
          value={args}
          onChange={(e) => setArgs(e.target.value)}
          fullWidth
          helperText='use a single space to separate multiple args'
          margin='normal'
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color='primary'>
          Cancel
        </Button>
        <Button onClick={handleSave} color='primary'>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  )
}
