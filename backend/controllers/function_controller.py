from flask import Blueprint, request, jsonify
from services.function_service import FunctionService
import os
import subprocess

function_app = Blueprint('function_app', __name__)
function_service = FunctionService()

@function_app.route('/api/functions', methods=['GET'])
def list_functions():
    functions = function_service.list_functions()
    return jsonify(functions), 200

@function_app.route('/api/functions/run', methods=['POST'])
def run_function():
    data = request.json
    filename = data.get('filename')
    args = data.get('args', [])
    if not filename:
        return jsonify({'error': 'Function name not provided'}), 400
    
    result = function_service.run_function(filename, args)
    return jsonify(result), 200 if 'output' in result else 500

@function_app.route('/api/functions/save', methods=['POST'])
def save_function():
    data = request.json
    filename = data.get('filename')
    content = data.get('content')
    if not filename or not content:
        return jsonify({'error': 'Filename and content are required'}), 400

    filepath = function_service.save_function(filename, content)
    return jsonify({'message': f'Saved function as {filepath}'}), 200

# Get the current working directory
CURRENT_DIR = os.getcwd()

# Directory where scripts will be saved (relative to the current working directory)
SCRIPTS_DIR = os.path.join(CURRENT_DIR, "scripts")

# Ensure the scripts directory exists
os.makedirs(SCRIPTS_DIR, exist_ok=True)

@function_app.route('/api/save-script', methods=['POST'])
def save_script():
    data = request.get_json()

    if 'name' not in data or 'script' not in data:
        return jsonify({"error": "Payload must contain 'name' and 'script'."}), 400

    script_name = f"{data['name']}.py"
    script_content = data['script']

    script_path = os.path.join(SCRIPTS_DIR, script_name)
    print(script_path)
    try:
        with open(script_path, 'w') as script_file:
            script_file.write(script_content)
        return jsonify({"message": f"Script '{script_name}' saved successfully."}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@function_app.route('/api/execute-script', methods=['POST'])
def execute_script():
    data = request.get_json()

    if 'name' not in data:
        return jsonify({"error": "Payload must contain 'name'."}), 400

    script_name = f"{data['name']}.py"
    script_path = os.path.join(SCRIPTS_DIR, script_name)

    if not os.path.isfile(script_path):
        return jsonify({"error": f"Script '{script_name}' not found."}), 404

    try:
        # Execute the script and capture the output and errors
        result = subprocess.run(['python', script_path], capture_output=True, text=True)

        # Return the output and errors (if any)
        response = {
            "output": result.stdout,
            "error": result.stderr
        }
        return jsonify(response), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500