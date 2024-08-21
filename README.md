# dynamic-integration-tester

## Usage

1. In `ui` folder do:

   - `npm i`
   - `npm start`

2. In `backend` folder do:
   - `pip install -r requirements.txt`
   - `python main.py`

## Project TODOs

## Task List

- [✅] **Create Checklist**

  - Add a checklist to this `README.md` to track TODOs (✅ done!).

- [ ] **Fix/Edit Feature**

  - Fix the 'edit' feature for functions; currently, it only opens a new function creator.

- [ ] **Default Functions**

  - Implement default functions for TCP and Kafka send/receive. Ensure scripts can manage connection settings.

- [ ] **File Import**

  - Add a file import feature to the connection settings.

- [ ] **Send-Only Mode**

  - Add a 'send-only' mode, enabling users to send data without receiving. Implement this and test case serialization before focusing on test case/assertion features.

- [ ] **Docker Refactor**

  - Refactor Docker integration:
    - Fix file loading and 'start all' functionality.
    - Save loaded files to the backend for persistence.
    - Investigate a library to translate compose data, potentially compatible with TypeScript.

- [✅] **UI Improvements**

  - Optimize the connection settings UI (e.g., use accordions to save space).
  - Further streamline `App.tsx` for simplicity.

- [ ] **Function Editor Enhancements**

  - Add custom arguments to the function editor, with a default argument for the script directory.
    - Create companion JSON files to store these arguments.

- [ ] **Startup Requests**

  - Implement a startup request to the backend to retrieve existing scripts.
    - Ensure the UI prevents users from creating duplicate functions/scripts.

- [ ] **Terminology Decision**

  - Decide whether to use "script" or "function" as the standard term.

- [ ] **Test Execution**

  - Build out the pass/fail mechanism for test execution.
  - Save test execution data as JSON and send it to the backend.
  - Query the backend for test cases and display them in a table with status indicators (e.g., grey `-` for unrun tests).

- [ ] **Project Management**

  - Implement a folder creation feature to organize test environments into separate projects.
    - Persist project data on the backend and query it upon startup.
    - Create a `<Startup>` component for initializing this data.

- [✅] **Code Editor Enhancements**

  - Add draggable imports and draggable buttons to the code editor for:
    - Retrieving environment variables.
    - Accessing transport tools.
    - Specifying the file path for output.

- [ ] **Add Clear Button to Code Editor**

  - Replace import button with 'clear' button for the editor
  - Fix some of the imported code statements - chatgpt might have done some weird stuff there
