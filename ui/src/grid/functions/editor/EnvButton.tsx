import React, { useState } from 'react'
import { Button, Menu, MenuItem } from '@mui/material'

interface EnvButtonProps {
  onSelectEnv: (envCode: string) => void
}

const EnvButton: React.FC<EnvButtonProps> = ({ onSelectEnv }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleSelect = () => {
    const envCode = `
import os

input_files = os.getenv('INPUT_FILES', '/default/input/path')
output_files = os.getenv('OUTPUT_FILES', '/default/output/path')

# Example usage:
# with open(os.path.join(input_files, 'yourfile.txt'), 'r') as f:
#     content = f.read()
`
    onSelectEnv(envCode)
    handleClose()
  }

  return (
    <>
      <Button variant='contained' color='secondary' onClick={handleClick}>
        Add Env Variables
      </Button>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem onClick={handleSelect}>Load Environment Variables</MenuItem>
      </Menu>
    </>
  )
}

export default EnvButton
