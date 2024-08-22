export interface FunctionProps {
    name: string,
    args?: string[]
  }
  
  export interface EditorState {
    editor: {
      isOpen: boolean;
      existingData: string | undefined;
    }
  }
  
  export interface FunctionsState {
    functionNames: string[];
    functions: {[functionName: string]: FunctionProps};
    selectedFunctionName: string | undefined;
    consoleOutput: string;
  }
  
 export const initialState: FunctionsState & EditorState = {
    functionNames: [],
    functions: {},
    selectedFunctionName: undefined,
    consoleOutput: "",
    editor: {
      isOpen: false,
      existingData: undefined
    }
  };