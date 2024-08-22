import os
import subprocess
import logging
import json

SCRIPT_DIRECTORY = 'scripts'
PREDEFINED_DIRECTORY = os.path.join(SCRIPT_DIRECTORY, 'predefined')
USER_DEFINED_DIRECTORY = os.path.join(SCRIPT_DIRECTORY, 'user_defined')

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

        # Save the script content
        with open(filepath, 'w') as file:
            file.write(content)

        # Save the arguments if provided
        if args:
            args_list = args.split()
            with open(json_filepath, 'w') as json_file:
                json.dump(args_list, json_file)

        return filepath

    def run_function(self, filename, args=None):
        try:
            # Initialize args if not provided
            args = args or []

            # Determine the correct directory
            filepath = self.get_function_filepath(filename)

            # Load additional args from a JSON file if it exists
            json_filepath = os.path.join(os.path.dirname(filepath), f"{filename}.json")
            if os.path.isfile(json_filepath):
                with open(json_filepath, 'r') as json_file:
                    args += json.load(json_file)

            # Run the script with the combined arguments
            result = subprocess.run(
                ['python', filepath] + args,
                check=True,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True
            )
            return {'output': result.stdout}
        except subprocess.CalledProcessError as e:
            logging.error(f"Error executing function {filename}: {e.stderr}")
            return {'error': e.stderr}
        except Exception as e:
            logging.error(f"Unexpected error: {str(e)}")
            return {'error': str(e)}

    def list_functions(self):
        functions = []
        try:
            # List all .py files in the predefined and user_defined directories
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
        # Check both directories for the function file
        if os.path.exists(os.path.join(self.predefined_dir, f"{filename}.py")):
            return os.path.join(self.predefined_dir, f"{filename}.py")
        return os.path.join(self.user_defined_dir, f"{filename}.py")
