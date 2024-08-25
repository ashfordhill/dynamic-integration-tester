import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import { useSelector, useDispatch } from 'react-redux'
import { Button } from '@mui/material'
import { selectTestCaseIds, selectTestCases, executeTestCase } from '../../store/testCaseSlice'
import { useMemo } from 'react'
import { selectReceiverConnection, selectSenderConnection } from '../../store/connectionSlice'
import { ConnectionDetails } from '../../types/connection'
import { AppDispatch } from '../../store/store'
import TestCaseResults from './TestCaseResults' // Import the new component
import { TestCase } from '../../types/testCase'

const TestCaseGrid = () => {
  const dispatch = useDispatch<AppDispatch>()
  const senderConnection = useSelector(selectSenderConnection)
  const receiverConnection = useSelector(selectReceiverConnection)
  const testCaseIds: string[] = useSelector(selectTestCaseIds)
  const testCases: Record<string, TestCase> = useSelector(selectTestCases)

  const handleExecute = (testCaseId: string) => {
    dispatch(executeTestCase({ testCaseId, senderConnection, receiverConnection }))
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
      renderCell: (params: GridRenderCellParams) => (
        <TestCaseResults testCaseId={params.id as string} /> // Use the new component
      )
    }
  ]

  const rows = useMemo(() => {
    return testCaseIds.map((id) => ({
      ...testCases[id]
    }))
  }, [testCaseIds, testCases])

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid rows={rows} columns={columns} pageSizeOptions={[5]} />
    </div>
  )
}

export default TestCaseGrid
