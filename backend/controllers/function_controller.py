from flask import Blueprint, request, jsonify
from services.function_service import FunctionService
import os

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
    args = data.get('args', '')
    
    if not filename or not content:
        return jsonify({'error': 'Filename and content are required'}), 400

    filepath = function_service.save_function(filename, content, args)
    return jsonify({'message': f'Saved function as {filepath}'}), 200

@function_app.route('/api/save-script', methods=['POST'])
def save_script():
    data = request.get_json()

    if 'name' not in data or 'script' not in data:
        return jsonify({"error": "Payload must contain 'name' and 'script'."}), 400

    try:
        script_name = data['name']
        script_content = data['script']
        script_args = data.get('args', '')

        filepath = function_service.save_function(script_name, script_content, script_args)

        return jsonify({"message": f"Script '{script_name}' saved successfully at {filepath}."}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@function_app.route('/api/execute-script', methods=['POST'])
def execute_script():
    data = request.get_json()

    if 'name' not in data:
        return jsonify({"error": "Payload must contain 'name'."}), 400

    script_name = data['name']
    result = function_service.run_function(script_name)

    return jsonify(result), 200 if 'output' in result else 500