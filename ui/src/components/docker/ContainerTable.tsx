import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../store/store'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material'
import { selectContainers } from '../../store/containerSlice'

export const ContainerTable: React.FC = () => {
  const containers = useSelector(selectContainers)

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Container</TableCell>
          <TableCell>Status</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {containers.map((container) => (
          <TableRow key={container.id}>
            <TableCell>{container.name}</TableCell>
            <TableCell>
              {container.running ? <CheckCircleIcon color='success' /> : <CancelIcon color='error' />}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
