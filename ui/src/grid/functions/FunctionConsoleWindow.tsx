import { Paper, Typography, Box } from '@mui/material'
import { useSelector } from 'react-redux'
import { selectConsoleOutput } from '../../store/functionSlice'

export const FunctionConsoleWindow = () => {
  const consoleOutput = useSelector(selectConsoleOutput)
  return (
    <Paper variant='outlined' sx={{ padding: 2, height: 200, overflowY: 'scroll' }}>
      <Typography variant='h6'>Command Output</Typography>
      <Box component='pre' sx={{ margin: 0 }}>
        {consoleOutput}
      </Box>
    </Paper>
  )
}
