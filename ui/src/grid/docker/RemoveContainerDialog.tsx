import React from 'react'
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../store/store'
import { dockerSliceName, removeContainer } from '../../store/dockerSlice'

interface RemoveContainerDialogProps {
  open: boolean
  onClose: () => void
}

export const RemoveContainerDialog: React.FC<RemoveContainerDialogProps> = ({ open, onClose }) => {
  const selectedContainer = useSelector((state: RootState) => state[dockerSliceName].selectedContainer)
  const dispatch = useDispatch()

  const handleRemove = () => {
    if (selectedContainer) {
      //dispatch(removeContainer(selectedContainer.name))
      onClose()
    }
  }

  if (!selectedContainer) return null

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Remove Container</DialogTitle>
      <DialogContent>
        Are you sure you want to remove the container <strong>{selectedContainer.name}</strong>?
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color='primary'>
          No
        </Button>
        <Button onClick={handleRemove} color='primary'>
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  )
}
