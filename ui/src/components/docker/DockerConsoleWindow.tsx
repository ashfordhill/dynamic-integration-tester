import { Paper, Typography, Box } from '@mui/material'
import { useSelector } from 'react-redux'
import { selectDockerOutput } from '../../store/containersSlice'

export const DockerConsoleWindow = () => {
  const dockerOutput = useSelector(selectDockerOutput)
  return (
    <Paper variant='outlined' sx={{ padding: 2, height: 200, overflowY: 'scroll' }}>
      <Typography variant='h6'>Docker Output</Typography>
      <Box component='pre' sx={{ margin: 0 }}>
        {dockerOutput}
      </Box>
    </Paper>
  )
}
