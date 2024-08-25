import React from 'react'
import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material'

const FileMappingTable: React.FC = () => {
  const fileMappings = [
    { inputFile: 'file1.xml', outputFile: 'file1.pcapng' },
    { inputFile: 'file2.xml', outputFile: 'file2.pcapng' }
    // Add more mappings as necessary
  ]

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Input File</TableCell>
          <TableCell>Output File</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {fileMappings.map((mapping, index) => (
          <TableRow key={index}>
            <TableCell>{mapping.inputFile}</TableCell>
            <TableCell>{mapping.outputFile}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default FileMappingTable
