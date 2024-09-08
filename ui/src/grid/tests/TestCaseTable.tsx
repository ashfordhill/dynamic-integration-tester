import React, { useMemo, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Button, Box, Typography, IconButton, Grid, Paper } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import {
  selectTestCaseIds,
  selectTestCases,
  executeTestCase,
  selectTestResults,
  selectTestResultsByTestCaseId
} from '../../store/testCaseSlice'
import { AppDispatch } from '../../store/store'
import { TestResultTable } from './TestResultTable'
import { TestCase, TestResult, TestResultType } from '../../types/testCase'
import { CreateTestCasePopup } from './CreateTestCasePopup'
import { selectReceiverConnection, selectSenderConnection } from '../../store/connectionSlice'
import { RemoveCircleOutline } from '@mui/icons-material'

const findLatestResult = (arr: TestResult[]): TestResult | undefined => {
  return arr.reduce((latest, current) => {
    // Convert the timestamp strings to Date objects
    const currentDate = new Date(current.rawData.timestamp)
    const latestDate = new Date(latest.rawData.timestamp)

    // Compare the dates
    return currentDate > latestDate ? current : latest
  })
}

const RowWithResults: React.FC<{
  row: TestCase
  isExpanded: boolean
  onExpandToggle: (id: string) => void
  testCaseId: string
}> = ({ row, isExpanded, onExpandToggle, testCaseId }) => {
  const testResultsForCase = useSelector(selectTestResultsByTestCaseId(testCaseId))
  const latestResult = findLatestResult(Object.values(testResultsForCase))
  const latestResultPassed: TestResultType | undefined = latestResult?.result
  return (
    <>
      {/* Main Row */}
      <Grid container alignItems='center' sx={{ padding: 1, borderBottom: '1px solid #ccc' }}>
        <Grid item xs={1}>
          <IconButton onClick={() => onExpandToggle(row.id)} size='small'>
            {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Grid>
        <Grid item xs={2}>
          <Typography>{row.id.slice(0, 8)}</Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography>{row.functionName}</Typography>
        </Grid>
        <Grid item xs={2}>
          <Typography>{row.inputFileName}</Typography>
        </Grid>
        <Grid item xs={2}>
          <Typography>{row.outputFileName}</Typography>
        </Grid>
        <Grid item xs={1}>
          {latestResultPassed === 'Pass' ? (
            <CheckCircleIcon color='success' />
          ) : latestResultPassed === 'Fail' ? (
            <CancelIcon color='error' />
          ) : (
            <RemoveCircleOutline color='disabled' />
          )}{' '}
        </Grid>
        <Grid item xs={1}>
          <Button variant='contained' color='primary'>
            Execute
          </Button>
        </Grid>
      </Grid>

      {/* Expanded Test Results */}
      {isExpanded && (
        <Box sx={{ marginLeft: 4, marginTop: 1, width: '100%' }}>
          <TestResultTable testResultIds={row.testResultIds} />
        </Box>
      )}
    </>
  )
}

export const TestCaseTable = () => {
  const dispatch = useDispatch<AppDispatch>()
  const senderConnection = useSelector(selectSenderConnection)
  const receiverConnection = useSelector(selectReceiverConnection)
  const testCaseIds: string[] = useSelector(selectTestCaseIds)
  const testResults: Record<string, TestResult> = useSelector(selectTestResults)
  const testCases: Record<string, TestCase> = useSelector(selectTestCases)
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())

  const handleExecute = (testCaseId: string) => {
    const testCase = testCases[testCaseId]
    if (testCase) {
      dispatch(
        executeTestCase({ testCaseId, senderConnection, receiverConnection, functionName: testCase.functionName })
      )
    } else {
      console.error('Could not find test case with ID of {}', testCaseId)
    }
  }

  const toggleRowExpansion = (testCaseId: string) => {
    setExpandedRows((prevExpandedRows) => {
      const newExpandedRows = new Set(prevExpandedRows)
      if (newExpandedRows.has(testCaseId)) {
        newExpandedRows.delete(testCaseId)
      } else {
        newExpandedRows.add(testCaseId)
      }
      return newExpandedRows
    })
  }

  const rows = useMemo(() => {
    return testCaseIds.map((id) => ({
      ...testCases[id],
      id // Ensure each row has the correct `id`
    }))
  }, [testCaseIds, testCases])

  return (
    <Box sx={{ width: '100%', maxWidth: '1000px', margin: '0 auto', position: 'relative' }}>
      <Box display='flex' justifyContent='space-between' alignItems='center' mb={2}>
        <Typography variant='h6'>Test Cases</Typography>
        <CreateTestCasePopup />
      </Box>

      {/* Table header */}
      <Paper elevation={3} sx={{ padding: 1, marginBottom: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={1}>
            <Typography>Results</Typography> {/* Added for Collapse/Expand */}
          </Grid>
          <Grid item xs={2}>
            <Typography>ID</Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography>Function Name</Typography>
          </Grid>
          <Grid item xs={2}>
            <Typography>Input File</Typography>
          </Grid>
          <Grid item xs={2}>
            <Typography>Output File</Typography>
          </Grid>
          <Grid item xs={1}>
            <Typography>Status</Typography>
          </Grid>
          <Grid item xs={1}>
            <Typography>Actions</Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Render rows dynamically and conditionally render TestResultTable inside the row */}
      {rows.map((row) => (
        <RowWithResults
          key={row.id}
          row={row}
          isExpanded={expandedRows.has(row.id)}
          onExpandToggle={toggleRowExpansion}
          testCaseId={row.id}
        />
      ))}
    </Box>
  )
}
