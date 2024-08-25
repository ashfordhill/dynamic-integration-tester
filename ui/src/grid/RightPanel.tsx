import { Drawer } from '@mui/material'
import { styled } from '@mui/system'
import { FunctionDropdown } from '../components/functions/FunctionDropdown'
import { FunctionActionButtons } from '../components/functions/FunctionActionButtons'
import { FunctionEditor } from '../components/functions/editor/FunctionEditor'
import { FunctionConsoleWindow } from '../components/functions/FunctionConsoleWindow'

const drawerWidthRight = 300

interface RightPanelProps {
  open: boolean
}

const StyledDrawerRight = styled(Drawer)(({ theme }) => ({
  width: drawerWidthRight,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: drawerWidthRight,
    boxSizing: 'border-box',
    position: 'relative' // Ensures it affects layout properly
  }
}))

export const RightPanel = ({ open }: RightPanelProps) => {
  return (
    <StyledDrawerRight variant='persistent' anchor='right' open={open}>
      <FunctionDropdown />
      <FunctionActionButtons />
      <FunctionEditor />
      <FunctionConsoleWindow />
    </StyledDrawerRight>
  )
}
