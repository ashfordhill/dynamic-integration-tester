import { Drawer } from '@mui/material'
import { styled } from '@mui/system'
import { UserUploadYaml } from './docker/UserUploadYaml'
import { ContainerTable } from './docker/ContainerTable'
import { ActionButtons } from './docker/ActionButtons'
import DockerControls from './docker/DockerControls'
import { DockerOutputWindow } from './docker/DockerOutputWindow'

const drawerWidthLeft = 300

interface LeftPanelProps {
  open: boolean
}

const StyledDrawerLeft = styled(Drawer)(({ theme }) => ({
  width: drawerWidthLeft,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: drawerWidthLeft,
    boxSizing: 'border-box',
    position: 'relative' // Ensure it stays within the layout flow
  }
}))

export const LeftPanel = ({ open }: LeftPanelProps) => {
  return (
    <StyledDrawerLeft variant='persistent' anchor='left' open={open}>
      <UserUploadYaml />
      <ContainerTable />
      <ActionButtons />
      <DockerControls />
      <DockerOutputWindow />
    </StyledDrawerLeft>
  )
}
