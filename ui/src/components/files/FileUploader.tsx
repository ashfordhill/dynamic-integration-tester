// src/components/FileUploader.tsx
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button, List, ListItem, ListItemText, Typography } from '@mui/material'
import { addInputFile, addOutputFile, selectInputFileNames, selectOutputFileNames } from '../../store/filesSlice'

interface FileUploaderProps {
  type: 'input' | 'output'
  title: string
}

export const FileUploader: React.FC<FileUploaderProps> = ({ type, title }) => {
  const dispatch = useDispatch()
  const files = useSelector(type === 'input' ? selectInputFileNames : selectOutputFileNames)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0]
      const fileName = file.name

      if (type === 'input') {
        dispatch(addInputFile({ fileName, displayName: fileName }))
      } else {
        dispatch(addOutputFile({ fileName, displayName: fileName }))
      }
    }
  }

  return (
    <div>
      <Typography variant='h6'>{title}</Typography>
      <Button variant='contained' component='label' sx={{ margin: '10px 0' }}>
        Upload {type === 'input' ? 'Input' : 'Output'} File
        <input accept='.pcapng,.xml' type='file' hidden onChange={handleFileUpload} />
      </Button>
      <List>
        {Object.entries(files).map(([fileName, displayName]) => (
          <ListItem key={fileName}>
            <ListItemText primary={displayName} />
          </ListItem>
        ))}
      </List>
    </div>
  )
}
