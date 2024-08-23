import React from 'react'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { useSelector } from 'react-redux'
import { selectTestCases } from '../../store/testCaseSlice'

const columns: GridColDef[] = [
  { field: 'inputFileName', headerName: 'Input File', width: 150 },
  { field: 'outputFileName', headerName: 'Output File', width: 150 }
]

const TestCaseTable: React.FC = () => {
  const testCases = useSelector(selectTestCases)

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid rows={testCases} columns={columns} getRowId={(row) => row.id} />
    </div>
  )
}

export default TestCaseTable
