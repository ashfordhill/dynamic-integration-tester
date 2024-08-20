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

    def list_functions(self):
        predefined = [f for f in os.listdir(self.predefined_dir) if f.endswith('.py')]
        user_defined = [f for f in os.listdir(self.user_defined_dir) if f.endswith('.py')]
        return {
            'predefined': predefined,
            'user_defined': user_defined
        }

    def save_function(self, filename, content, args=None, is_user_defined=True):
        directory = self.user_defined_dir if is_user_defined else self.predefined_dir
        filepath = os.path.join(directory, f"{filename}.py")
        json_filepath = os.path.join(directory, f"{filename}.json")

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
            args = args or []
            filepath = self.get_function_filepath(filename)

            # Load args from JSON file if they exist
            json_filepath = os.path.join(os.path.dirname(filepath), f"{filename}.json")
            if os.path.isfile(json_filepath):
                with open(json_filepath, 'r') as json_file:
                    args += json.load(json_file)

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

    def get_function_filepath(self, filename):
        if os.path.exists(os.path.join(self.predefined_dir, f"{filename}.py")):
            return os.path.join(self.predefined_dir, f"{filename}.py")
        return os.path.join(self.user_defined_dir, f"{filename}.py")