import React, { useMemo, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Button, Box, Typography, IconButton, Grid, Paper, useTheme } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import {
  selectTestCaseIds,
  selectTestCases,
  executeTestCase,
  selectTestResultsByTestCaseId
} from '../../../store/testCaseSlice'
import { TestResultTable } from './TestResultTable'
import { TestCase, TestResult, TestResultType } from '../../../types/testCase'
import { RemoveCircleOutline } from '@mui/icons-material'
import { CreateTestCasePopup } from './CreateTestCasePopup'
import { AppDispatch } from '../../../store/store'

const findLatestResult = (arr: TestResult[]): TestResult | undefined => {
  if (arr.length === 0) {
    return undefined
  }

  if (arr.length === 1) {
    return arr[0]
  }

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
}> = ({ row, isExpanded, onExpandToggle }) => {
  const dispatch = useDispatch<AppDispatch>()
  const testResultsForCase = useSelector(selectTestResultsByTestCaseId(row.id))
  const latestResult = findLatestResult(testResultsForCase)
  const latestResultPassed: TestResultType | undefined = latestResult?.result

  const handleExecute = () => {
    dispatch(executeTestCase({ testCaseId: row.id, functionName: row.functionName }))
  }

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
        <Grid item xs={2} container spacing={6}>
          <Grid item>
            {latestResultPassed === 'Pass' ? (
              <CheckCircleIcon color='success' />
            ) : latestResultPassed === 'Fail' ? (
              <CancelIcon color='error' />
            ) : (
              <RemoveCircleOutline color='disabled' />
            )}{' '}
          </Grid>
          <Grid item>
            <Button variant='contained' color='primary' onClick={handleExecute}>
              Execute
            </Button>
          </Grid>
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
  const testCaseIds: string[] = useSelector(selectTestCaseIds)
  const testCases: Record<string, TestCase> = useSelector(selectTestCases)
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())

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
    <Box sx={{ width: '100%', maxWidth: '1100px', margin: '0 auto', position: 'relative' }}>
      <Box display='flex' justifyContent='space-between' alignItems='center' mb={2} mt={2}>
        <Typography variant='h6'>Test Cases</Typography>
        <CreateTestCasePopup />
      </Box>

      {/* Table header */}
      <Paper sx={{ padding: 1, marginBottom: 2, backgroundImage: 'none', transition: 'none' }}>
        <Grid container>
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
          <Grid item xs={2} container spacing={4}>
            <Grid item>
              <Typography>Status</Typography>
            </Grid>
            <Grid item>
              <Typography>Actions</Typography>
            </Grid>
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
        />
      ))}
    </Box>
  )
}
