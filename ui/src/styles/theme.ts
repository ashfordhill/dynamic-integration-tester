import { createTheme } from '@mui/material/styles'
import { red, green } from '@mui/material/colors' // Use predefined color palettes for consistency

const theme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#0E0F0F', // Dark grey for the main background
      paper: '#161819' // Slightly lighter grey for card-like components
    },
    primary: {
      main: '#1565c0' // Dim the blue button
    },
    secondary: {
      main: '#7b1fa2' // Dim the pink button
    },
    error: {
      main: '#d74343' // Use Material UI's red for error
    },
    success: {
      main: '#6bc16f' // Use Material UI's green for success
    },
    text: {
      primary: '#D3D3D3' // Light text color for better contrast
    }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.5)', // Adding shadow to buttons
          backgroundColor: '#212121', // Dimming the button color
          color: '#D3D3D3',
          '&:hover': {
            backgroundColor: '#1565c0', // Slightly lighter blue on hover
            boxShadow: '0px 6px 15px rgba(0, 0, 0, 0.6)' // Stronger shadow on hover
          }
        },
        containedPrimary: {
          backgroundColor: '#1565c0 !important' // Enforce dim color
        },
        containedSecondary: {
          backgroundColor: '#7b1fa2 !important' // Enforce dim pink
        }
      }
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#000000 !important', // Enforce dark AppBar
          color: '#f5f5f5 !important' // Enforce light text
        }
      }
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          backgroundColor: '#0E0F0F !important', // Enforce dark Accordion
          color: '#D3D3D3 !important', // Enforce light text
          '&.Mui-expanded': {
            backgroundColor: '#212121 !important' // Slightly darker when expanded
          },
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.5)'
        }
      }
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: '#D3D3D3 !important' // Ensure the icon color contrasts well with the background
        }
      }
    },
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#121212',
          color: '#f5f5f5'
        },
        '.container': {
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.7)'
        },
        button: {
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.5)',
          '&:hover': {
            boxShadow: '0px 6px 15px rgba(0, 0, 0, 0.6)'
          }
        },
        '.MuiPaper-root': {
          backgroundColor: '#1c1e1f !important'
        },
        '.MuiContainer-root': {
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.6)'
        }
      }
    },
    MuiSvgIcon: {
      styleOverrides: {
        root: {
          fontSize: '1.5rem' // Adjust the icon size to make it sharper
        }
      }
    }
  }
})

export default theme
