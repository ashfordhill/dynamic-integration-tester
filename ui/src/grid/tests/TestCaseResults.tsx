import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { selectTestResultByTestCaseId } from '../../store/testCaseSlice'
import { Box, IconButton, Tooltip, Dialog, DialogTitle, DialogContent } from '@mui/material'
import { CheckCircle, Cancel, RemoveCircleOutline, Info as InfoIcon, Close } from '@mui/icons-material'
import { TestResult } from '../../types/testCase'

interface TestCaseResultsProps {
  testCaseId: string
}

const TestCaseResults: React.FC<TestCaseResultsProps> = ({ testCaseId }) => {
  const result: TestResult | undefined = useSelector(selectTestResultByTestCaseId(testCaseId))
  const [resultDialogOpen, setResultDialogOpen] = useState(false)

  if (!result) {
    return (
      <Box display='flex' alignItems='center' justifyContent='flex-start' height='100%'>
        <RemoveCircleOutline />
      </Box>
    )
  }

  return (
    <>
      <Box display='flex' alignItems='center' justifyContent='flex-start' height='100%'>
        {result.result === 'Pass' ? (
          <CheckCircle color='success' />
        ) : (
          <>
            <Cancel color='error' />
            {result.resultMessage && (
              <Tooltip title='View error message'>
                <IconButton color='warning' onClick={() => setResultDialogOpen(true)} size='small'>
                  <InfoIcon />
                </IconButton>
              </Tooltip>
            )}
          </>
        )}
      </Box>
      <Dialog open={resultDialogOpen} onClose={() => setResultDialogOpen(false)}>
        <DialogTitle>
          <IconButton
            onClick={() => setResultDialogOpen(false)}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500]
            }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box component='pre' sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
            {result.resultMessage}
          </Box>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default TestCaseResults
