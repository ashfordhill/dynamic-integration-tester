import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    mode: 'dark', // Enables dark mode
    background: {
      default: '#171819', // Dark grey for the main background
      paper: '#171819' // Slightly lighter grey for card-like components
    },
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0'
    },
    secondary: {
      main: '#9c27b0',
      light: '#ba68c8',
      dark: '#7b1fa2'
    },
    error: {
      main: '#d32f2f',
      light: '#ef5350',
      dark: '#c62828'
    },
    warning: {
      main: '#ed6c02',
      light: '#ff9800',
      dark: '#e65100'
    },
    info: {
      main: '#0288d1',
      light: '#03a9f4',
      dark: '#0579b'
    },
    success: {
      main: '#2e7d32',
      light: '#4caf50',
      dark: '#01579b'
    }
  }
})

export default theme
