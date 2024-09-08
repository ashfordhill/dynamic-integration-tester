import os
import subprocess
import logging
import json
from typing import Dict, Any
from datetime import datetime
import uuid  # Import the uuid module

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[logging.StreamHandler()]
)
FAIL = 'Fail'
PASS = 'Pass'
SCRIPT_DIRECTORY = 'scripts'
PREDEFINED_DIRECTORY = os.path.join(SCRIPT_DIRECTORY, 'predefined')
USER_DEFINED_DIRECTORY = os.path.join(SCRIPT_DIRECTORY, 'user_defined')
UPLOADS_DIRECTORY = 'uploads'

class FunctionService:
    def __init__(self):
        self.predefined_dir = PREDEFINED_DIRECTORY
        self.user_defined_dir = USER_DEFINED_DIRECTORY
        self.ensure_directories()

    def ensure_directories(self):
        os.makedirs(self.predefined_dir, exist_ok=True)
        os.makedirs(self.user_defined_dir, exist_ok=True)

    def save_function(self, filename, content, args=None):
        filepath = os.path.join(self.user_defined_dir, f"{filename}.py")
        json_filepath = os.path.join(self.user_defined_dir, f"{filename}.json")

        with open(filepath, 'w') as file:
            file.write(content)

        if args:
            args_list = args.split()
            with open(json_filepath, 'w') as json_file:
                json.dump(args_list, json_file)

        return filepath

    def run_function(self, filename, args=None):
        try:
            args = args or []
            filepath = self.get_function_filepath(filename)
            json_filepath = os.path.join(os.path.dirname(filepath), f"{filename}.json")
            if os.path.isfile(json_filepath):
                with open(json_filepath, 'r') as json_file:
                    args += json.load(json_file)

            env = os.environ.copy()  # Start with a copy of the current environment
            env['INPUT_FILES'] = os.path.join(os.path.abspath(UPLOADS_DIRECTORY), "inputs")
            env['OUTPUT_FILES'] = os.path.join(os.path.abspath(UPLOADS_DIRECTORY), "outputs")

            result = subprocess.run(
                ['python', filepath] + args,
                check=True,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True,
                env=env
            )
            return {'output': result.stdout}
        except subprocess.CalledProcessError as e:
            logging.error(f"Error executing function {filename}: {e.stderr}")
            return {'error': e.stderr}
        except Exception as e:
            logging.error(f"Unexpected error: {str(e)}")
            return {'error': str(e)}

    def run_test(
        self, 
        test_case_id: str,
        function_name: str, 
        sender_connection: Dict[str, Any], 
        receiver_connection: Dict[str, Any], 
        input_file: str, 
        output_file: str
    ) -> Dict[str, Any]:
        try:
            print(f"Test Case ID: {test_case_id}")
            print(f"Function Name: {function_name}")
            print(f"Sender Connection: {sender_connection}")
            print(f"Receiver Connection: {receiver_connection}")
            print(f"Input File: {input_file}")
            print(f"Output File: {output_file}")

            script_path = self.get_function_filepath(function_name)
            input_file_path = os.path.join(UPLOADS_DIRECTORY, 'inputs', input_file)
            output_file_path = os.path.join(UPLOADS_DIRECTORY, 'outputs', output_file) if output_file else ""

            command = [
                'python', script_path,
                json.dumps(sender_connection),
                json.dumps(receiver_connection),
                input_file_path,
                output_file_path
            ]

            print(f"Running command: {' '.join(command)}")

            # Run the subprocess and capture output
            result = subprocess.run(
                command, 
                check=True, 
                stdout=subprocess.PIPE, 
                stderr=subprocess.PIPE, 
                text=True,
                timeout=60  # Increased timeout
            )

            # Output the logs
            print("Subprocess logs (stderr):")
            print(result.stderr)

            # Extract JSON output from stdout
            stdout_lines = result.stdout.splitlines()
            json_output = ""
            inside_json = False

            for line in stdout_lines:
                if line.strip() == "START_JSON_OUTPUT":
                    inside_json = True
                    continue
                elif line.strip() == "END_JSON_OUTPUT":
                    inside_json = False
                    break
                if inside_json:
                    json_output += line

            if json_output:
                result_data = json.loads(json_output)
            else:
                logging.error("Subprocess did not return any JSON output.")
                return {'error': "Subprocess did not return any JSON output."}

            # Check if the test succeeded
            test_status = "success" if "error" not in result_data else "failed"

            # Prepare the result to be returned
            test_result = {
                "id": f"{uuid.uuid4()}",
                "test_case_id": test_case_id,
                "function_name": function_name,
                "sender_connection": sender_connection,
                "receiver_connection": receiver_connection,
                "input_file": input_file,
                "output_file": output_file,
                "output": result_data.get("output", ""),
                "input": result_data.get("input", ""),
                "status": test_status,
                "timestamp": datetime.utcnow().isoformat(),
                "results": result_data
            }

            # If an output file was provided, save the result
            if output_file:                
                # Save all test results in the test-results directory at the root level
                test_result_dir = os.path.join(os.getcwd(), 'test-results')
                os.makedirs(test_result_dir, exist_ok=True)
                test_result_path = os.path.join(test_result_dir, f"{function_name}_{test_case_id}_{test_result['id']}_result.json")

                logging.debug(f"Saving test result to {test_result_path}")  # Log the file path

                with open(test_result_path, 'w') as json_file:
                    json.dump(test_result, json_file, indent=4)
                    logging.debug(f"Test result saved to {test_result_path}")  # Log after saving

            return test_result

        except subprocess.CalledProcessError as e:
            logging.error(f"Error executing test {function_name}: {e.stderr}")
            return {'error': e.stderr}
        except subprocess.TimeoutExpired as e:
            logging.error(f"Test {function_name} timed out: {str(e)}")
            return {'error': f"Test timed out: {str(e)}"}
        except Exception as e:
            logging.error(f"Unexpected error: {str(e)}")
            return {'error': str(e)}
        
    def save_test_result(self, test_result: Dict[str, Any]):
        try:
            logging.error(f"TEST RESULT: {test_result}")
            print(f"TEST RESULT: {test_result}")
            test_result_dir = os.path.join(os.getcwd(), 'test-results')
            os.makedirs(test_result_dir, exist_ok=True)
            test_result_path = os.path.join(test_result_dir, f"{test_result['functionName']}_{test_result['id']}_result.json")

            logging.error(f"Saving test result to {test_result_path}")

            with open(test_result_path, 'w') as json_file:
                json.dump(test_result, json_file, indent=4)
                logging.error(f"Test result saved to {test_result_path}")
            return {"message": "Test result saved successfully"}
        except Exception as e:
            logging.error(f"Error saving test result: {str(e)}")
            return {"error": str(e)}
    def list_functions(self):
        functions = []
        try:
            for directory in [self.predefined_dir, self.user_defined_dir]:
                for filename in os.listdir(directory):
                    if filename.endswith('.py'):
                        function_name = filename[:-3]
                        function_data = {'name': function_name}
                        json_filepath = os.path.join(directory, f"{function_name}.json")
                        if os.path.isfile(json_filepath):
                            with open(json_filepath, 'r') as json_file:
                                function_data['args'] = json.load(json_file)
                        functions.append(function_data)
            return functions
        except Exception as e:
            logging.error(f"Error listing functions: {str(e)}")
            return {'error': str(e)}

    def get_function_filepath(self, filename):
        if os.path.exists(os.path.join(self.predefined_dir, f"{filename}.py")):
            return os.path.join(self.predefined_dir, f"{filename}.py")
        return os.path.join(self.user_defined_dir, f"{filename}.py")
