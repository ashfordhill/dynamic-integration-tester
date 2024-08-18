import os
import subprocess
import logging

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

    def save_function(self, filename, content, is_user_defined=True):
        directory = self.user_defined_dir if is_user_defined else self.predefined_dir
        filepath = os.path.join(directory, filename)
        with open(filepath, 'w') as file:
            file.write(content)
        return filepath

    def run_function(self, filename, args=None):
        try:
            args = args or []
            filepath = self.get_function_filepath(filename)
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

    def get_function_filepath(self, filename):
        if os.path.exists(os.path.join(self.predefined_dir, filename)):
            return os.path.join(self.predefined_dir, filename)
        return os.path.join(self.user_defined_dir, filename)
