import { AppBar, Toolbar, IconButton, Typography, Box } from '@mui/material'
import { Menu } from '@mui/icons-material'

interface MenuBarProps {
  leftDrawerOpen: boolean
  rightDrawerOpen: boolean
  onLeftDrawerToggle: () => void
  onRightDrawerToggle: () => void
}

export const MenuBar = ({ leftDrawerOpen, rightDrawerOpen, onLeftDrawerToggle, onRightDrawerToggle }: MenuBarProps) => {
  return (
    <AppBar position='static'>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box display='flex' alignItems='center'>
          <IconButton
            edge='start'
            color='inherit'
            onClick={onLeftDrawerToggle}
            aria-label='open left drawer'
            sx={{ mr: 2 }}
          >
            <Menu />
          </IconButton>
        </Box>
        <IconButton edge='end' color='inherit' onClick={onRightDrawerToggle} aria-label='open right drawer'>
          <Menu />
        </IconButton>
      </Toolbar>
    </AppBar>
  )
}
