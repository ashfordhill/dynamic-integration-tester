import React, { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent
} from '@mui/material'
import { CheckCircle, Cancel, Info as InfoIcon, Close } from '@mui/icons-material'
import { useSelector } from 'react-redux'
import { selectTestResults } from '../../store/testCaseSlice'
import { TestResult } from '../../types/testCase'

interface TestCaseResultsTableProps {
  testResultIds: string[]
}

export const TestResultTable: React.FC<TestCaseResultsTableProps> = ({ testResultIds }) => {
  const testResults: Record<string, TestResult> = useSelector(selectTestResults)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogContent, setDialogContent] = useState('')

  const handleOpenDialog = (message: string) => {
    setDialogContent(message)
    setDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setDialogOpen(false)
    setDialogContent('')
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Result</TableCell>
            <TableCell>Result Message</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {testResultIds.map((testResultId) => {
            const result = testResults[testResultId]
            return (
              <TableRow key={result.id}>
                <TableCell>{result.id}</TableCell>
                <TableCell>
                  <Box display='flex' alignItems='center'>
                    {result.result === 'Pass' ? <CheckCircle color='success' /> : <Cancel color='error' />}
                  </Box>
                </TableCell>
                <TableCell>
                  {result.result === 'Fail' && result.resultMessage && (
                    <Tooltip title='View error message'>
                      <IconButton
                        color='warning'
                        onClick={() => handleOpenDialog(result.resultMessage ?? '')}
                        size='small'
                      >
                        <InfoIcon />
                      </IconButton>
                    </Tooltip>
                  )}
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>

      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>
          <IconButton
            onClick={handleCloseDialog}
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
            {dialogContent}
          </Box>
        </DialogContent>
      </Dialog>
    </TableContainer>
  )
}

export default TestResultTable
