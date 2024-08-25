import { configureStore } from '@reduxjs/toolkit'
import containersReducer, { dockerSliceName } from './dockerSlice'
import functionsReducer, { functionsSliceName } from './functionSlice'
import connectionsReducer, { connectionsSliceName } from './connectionSlice'
import filesReducer, { filesSliceName } from './fileSlice'
import testCaseReducer, { testCaseSliceName } from './testCaseSlice'
import { thunk } from 'redux-thunk'

export const store = configureStore({
  reducer: {
    [dockerSliceName]: containersReducer,
    [functionsSliceName]: functionsReducer,
    [connectionsSliceName]: connectionsReducer,
    [filesSliceName]: filesReducer,
    [testCaseSliceName]: testCaseReducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk)
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
