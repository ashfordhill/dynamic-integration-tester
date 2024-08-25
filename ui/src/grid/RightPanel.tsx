import { Drawer } from '@mui/material'
import { styled } from '@mui/system'
import { FunctionDropdown } from './functions/FunctionDropdown'
import { FunctionActionButtons } from './functions/FunctionActionButtons'
import { FunctionConsoleWindow } from './functions/FunctionConsoleWindow'
import { FunctionEditor } from './functions/editor/FunctionEditor'

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
