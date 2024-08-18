from flask import Blueprint, request, jsonify
from services.function_service import FunctionService

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
