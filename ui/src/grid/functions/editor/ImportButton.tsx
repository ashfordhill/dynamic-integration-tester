import React, { useState } from 'react'
import { Button, Menu, MenuItem } from '@mui/material'

interface ImportButtonProps {
  onSelectImport: (importStatement: string) => void
}

const ImportButton: React.FC<ImportButtonProps> = ({ onSelectImport }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleSelect = (importStatement: string) => {
    onSelectImport(importStatement)
    handleClose()
  }

  return (
    <>
      <Button variant='contained' color='primary' onClick={handleClick}>
        Add Import
      </Button>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem onClick={() => handleSelect('import socket')}>TCP</MenuItem>
        <MenuItem onClick={() => handleSelect('import socket')}>UDP</MenuItem>
        <MenuItem onClick={() => handleSelect('import kafka-lib')}>Kafka</MenuItem>

        {/* Add more imports as needed */}
      </Menu>
    </>
  )
}

export default ImportButton
