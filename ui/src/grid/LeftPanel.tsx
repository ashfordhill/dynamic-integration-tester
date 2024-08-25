import { Drawer } from '@mui/material'
import { styled } from '@mui/system'
import { UserUploadYaml } from '../components/docker/UserUploadYaml'
import { ContainerTable } from '../components/docker/ContainerTable'
import { ActionButtons } from '../components/docker/ActionButtons'
import DockerControls from '../components/docker/DockerControls'
import { DockerConsoleWindow } from '../components/docker/DockerConsoleWindow'

const drawerWidthLeft = 240;

interface LeftPanelProps {
  open: boolean
}

const StyledDrawerLeft = styled(Drawer)(({ theme }) => ({
  width: drawerWidthLeft,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: drawerWidthLeft,
    boxSizing: 'border-box',
    position: 'relative', // Ensure it stays within the layout flow
  },
}))

export const LeftPanel = ({ open }: LeftPanelProps) => {
  return (
    <StyledDrawerLeft variant='persistent' anchor='left' open={open}>
      <UserUploadYaml />
      <ContainerTable />
      <ActionButtons />
      <DockerControls />
      <DockerConsoleWindow />
    </StyledDrawerLeft>
  )
}