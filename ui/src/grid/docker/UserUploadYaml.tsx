import { Box, Input } from '@mui/material'
import { importDockerCompose } from '../../utils/importDockerCompose'
import { useDispatch } from 'react-redux'

export const UserUploadYaml = () => {
  const dispatch = useDispatch()
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      readFileContent(file)
    }
  }
  const readFileContent = (file: File) => {
    const reader = new FileReader()
    reader.onload = () => {
      if (reader.result) {
        importDockerCompose(reader.result as string, dispatch)
      }
    }
    reader.readAsText(file)
  }

  return (
    <Box mt={4}>
      <Input type='file' inputProps={{ accept: '.yaml,.yml' }} onChange={handleFileChange} />
    </Box>
  )
}
