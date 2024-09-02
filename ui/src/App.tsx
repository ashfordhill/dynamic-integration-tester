import { CssBaseline } from '@mui/material'
import { useState } from 'react'
import { styled } from '@mui/system'
import { LeftPanel } from './grid/LeftPanel'
import { MiddlePanel } from './grid/MiddlePanel'
import { RightPanel } from './grid/RightPanel'
import { MenuBar } from './grid/MenuBar'

const AppContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  height: '100vh'
})

const ContentContainer = styled('div')({
  display: 'flex',
  flexGrow: 1
})

interface MiddleContentProps {
  leftDrawerOpen: boolean
  rightDrawerOpen: boolean
}

const MiddleContent = styled('div', {
  shouldForwardProp: (prop) => prop !== 'leftDrawerOpen' && prop !== 'rightDrawerOpen'
})<MiddleContentProps>(({ leftDrawerOpen, rightDrawerOpen }) => ({
  flexGrow: 1,
  overflow: 'auto',
  position: 'relative',
  paddingTop: '16px' // Add padding to move the MiddlePanel down
}))

export const App = () => {
  const [leftDrawerOpen, setLeftDrawerOpen] = useState(true)
  const [rightDrawerOpen, setRightDrawerOpen] = useState(true)

  return (
    <>
      <CssBaseline />
      <AppContainer>
        <MenuBar
          leftDrawerOpen={leftDrawerOpen}
          rightDrawerOpen={rightDrawerOpen}
          onLeftDrawerToggle={() => setLeftDrawerOpen(!leftDrawerOpen)}
          onRightDrawerToggle={() => setRightDrawerOpen(!rightDrawerOpen)}
        />
        <ContentContainer>
          {leftDrawerOpen && <LeftPanel open={leftDrawerOpen} />}
          <MiddleContent leftDrawerOpen={leftDrawerOpen} rightDrawerOpen={rightDrawerOpen}>
            <MiddlePanel />
          </MiddleContent>
          {rightDrawerOpen && <RightPanel open={rightDrawerOpen} />}
        </ContentContainer>
      </AppContainer>
    </>
  )
}
