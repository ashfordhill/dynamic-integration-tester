import React, { useState } from 'react'
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button } from '@mui/material'
import { useDispatch } from 'react-redux'
import { addContainer } from '../../store/containerSlice'
import { v4 as uuidv4 } from 'uuid' // Import uuid for generating unique IDs

interface AddContainerDialogProps {
  open: boolean
  onClose: () => void
}

export const AddContainerDialog: React.FC<AddContainerDialogProps> = ({ open, onClose }) => {
  const [container, setContainer] = useState({
    name: '',
    image: '',
    ports: '',
    environment: '',
    volumes: '',
    network: ''
  })
  const dispatch = useDispatch()

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setContainer({
      ...container,
      [event.target.name]: event.target.value
    })
  }

  const handleAdd = () => {
    dispatch(
      addContainer({
        id: uuidv4(), // Generate a unique ID for the container
        name: container.name,
        image: container.image,
        ports: container.ports.split(',').map((item) => item.trim()),
        environment: container.environment.split(',').map((item) => item.trim()),
        volumes: container.volumes.split(',').map((item) => item.trim()),
        network: container.network,
        running: false // Initialize as not running
      })
    )
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add New Container</DialogTitle>
      <DialogContent>
        <TextField
          label='Container Name'
          name='name'
          value={container.name}
          onChange={handleChange}
          fullWidth
          margin='normal'
        />
        <TextField
          label='Image'
          name='image'
          value={container.image}
          onChange={handleChange}
          fullWidth
          margin='normal'
        />
        <TextField
          label='Ports'
          name='ports'
          value={container.ports}
          onChange={handleChange}
          fullWidth
          margin='normal'
        />
        <TextField
          label='Environment Variables'
          name='environment'
          value={container.environment}
          onChange={handleChange}
          fullWidth
          margin='normal'
        />
        <TextField
          label='Volumes'
          name='volumes'
          value={container.volumes}
          onChange={handleChange}
          fullWidth
          margin='normal'
        />
        <TextField
          label='Network'
          name='network'
          value={container.network}
          onChange={handleChange}
          fullWidth
          margin='normal'
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color='primary'>
          Cancel
        </Button>
        <Button onClick={handleAdd} color='primary'>
          Add
        </Button>
      </DialogActions>
    </Dialog>
  )
}
