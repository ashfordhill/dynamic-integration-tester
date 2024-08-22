import React, { ReactNode, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import axios from 'axios'
import { FunctionProps } from './types/function'
import { addFunction } from './store/functionsSlice'

interface StartupProps {
  children: ReactNode
}

export const Startup: React.FC<StartupProps> = ({ children }) => {
  const dispatch = useDispatch()

  useEffect(() => {
    const fetchFunctions = async () => {
      try {
        const response = await axios.get('/api/functions')
        const functions: FunctionProps[] = response.data.map((fn: any) => ({
          name: fn.name,
          args: fn.args || []
        }))

        functions.forEach((func: FunctionProps) => {
          dispatch(addFunction(func))
        })
      } catch (error) {
        console.error('Error fetching functions:', error)
      }
    }

    fetchFunctions()
  }, [dispatch])
  return <>{children}</>
}
