import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import { useSelector, useDispatch } from 'react-redux'
import { Button, Box, Typography } from '@mui/material'
import { selectTestCaseIds, selectTestCases, executeTestCase } from '../../store/testCaseSlice'
import { useMemo } from 'react'
import { selectReceiverConnection, selectSenderConnection } from '../../store/connectionSlice'
import { AppDispatch } from '../../store/store'
import TestCaseResults from './TestCaseResults' // Import the updated component
import { TestCase } from '../../types/testCase'
import { CreateTestCasePopup } from './CreateTestCasePopup'

const TestCaseGrid = () => {
  const dispatch = useDispatch<AppDispatch>()
  const senderConnection = useSelector(selectSenderConnection)
  const receiverConnection = useSelector(selectReceiverConnection)
  const testCaseIds: string[] = useSelector(selectTestCaseIds)
  const testCases: Record<string, TestCase> = useSelector(selectTestCases)

  const handleExecute = (testCaseId: string) => {
    const testCase = testCases[testCaseId]
    if (testCase) {
      dispatch(
        executeTestCase({ testCaseId, senderConnection, receiverConnection, functionName: testCase.functionName })
      )
    } else {
      // I don't think this would ever happen?
      console.error('Could not find test case with ID of {}', testCaseId)
    }
  }

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 150 },
    { field: 'inputFileName', headerName: 'Input File', width: 200 },
    { field: 'outputFileName', headerName: 'Output File', width: 200 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params: GridRenderCellParams) => (
        <Button variant='contained' color='primary' onClick={() => handleExecute(params.id as string)}>
          Execute
        </Button>
      )
    },
    {
      field: 'results',
      headerName: 'Results',
      width: 300,
      renderCell: (params: GridRenderCellParams) => <TestCaseResults testCaseId={params.id as string} />
    }
  ]

  const rows = useMemo(() => {
    return testCaseIds.map((id) => ({
      ...testCases[id]
    }))
  }, [testCaseIds, testCases])

  return (
    <Box sx={{ height: 400, width: '100%', maxWidth: '800px', margin: '0 auto', position: 'relative' }}>
      <Box display='flex' justifyContent='space-between' alignItems='center' mb={2}>
        <Typography variant='h6'>Test Cases</Typography>
        <CreateTestCasePopup />
      </Box>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSizeOptions={[5]}
        disableColumnMenu
        sx={{
          '& .MuiDataGrid-scrollbar--horizontal': {
            display: 'none' // This will hide the horizontal scrollbar
          }
        }}
      />
    </Box>
  )
}

export default TestCaseGrid
