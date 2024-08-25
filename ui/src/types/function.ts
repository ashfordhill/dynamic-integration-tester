export interface FunctionProps {
  name: string
  args?: string[]
}

export interface EditorState {
  editor: {
    isOpen: boolean
    existingData: string | undefined
  }
}

export interface FunctionState {
  functionNames: string[]
  functions: { [functionName: string]: FunctionProps }
  selectedFunctionName: string | undefined
  consoleOutput: string
}

export const initialState: FunctionState & EditorState = {
  functionNames: [],
  functions: {},
  selectedFunctionName: undefined,
  consoleOutput: '',
  editor: {
    isOpen: false,
    existingData: undefined
  }
}
