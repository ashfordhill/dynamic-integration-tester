export interface FileState {
  inputFiles: { [fileName: string]: string }
  outputFiles: { [fileName: string]: string }
}
export const initialState: FileState = {
  inputFiles: {},
  outputFiles: {}
}
