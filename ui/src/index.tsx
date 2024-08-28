import React from 'react'
import { Provider } from 'react-redux'
import { store } from './store/store' // Make sure this path is correct
import { App } from './App'
import { Startup } from './Startup'
import theme from './styles/theme'
import { ThemeProvider } from '@mui/material/styles'
import { CssBaseline } from '@mui/material'
import { createRoot } from 'react-dom/client'

const root = createRoot(document.getElementById('root') as Element)
root.render(
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Startup>
        <App />
      </Startup>
    </ThemeProvider>
  </Provider>
)
