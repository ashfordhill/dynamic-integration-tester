import { Box, Button, Input, CircularProgress } from '@mui/material'
import { importDockerCompose } from '../../utils/importDockerCompose'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading, selectLoading } from '../../store/dockerSlice'

export const UserUploadYaml = () => {
  const dispatch = useDispatch()
  const loading = useSelector(selectLoading)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      readFileContent(file)
    }
  }

  const readFileContent = async (file: File) => {
    const reader = new FileReader()
    dispatch(setLoading(true))
    reader.onload = async () => {
      if (reader.result) {
        await importDockerCompose(reader.result as string, dispatch)
        dispatch(setLoading(false))
      }
    }
    reader.readAsText(file)
  }

  return (
    <Box mt={4} display="flex" flexDirection="column" alignItems="center">
      <Input type="file" inputProps={{ accept: '.yaml,.yml' }} onChange={handleFileChange} disabled={loading} />
      {loading && <CircularProgress />}
    </Box>
  )
}
