import os
import glob
import json
from flask import Blueprint, request, jsonify
from services.function_service import FunctionService
import logging 

function_app = Blueprint('function_app', __name__)
function_service = FunctionService()

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
    args = data.get('args', [])
    result = function_service.run_function(script_name, args)

    return jsonify(result), 200 if 'output' in result else 500

@function_app.route('/api/functions', methods=['GET'])
def list_functions():
    try:
        functions = function_service.list_functions()
        return jsonify(functions), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@function_app.route('/api/execute-test', methods=['POST'])
def execute_test():
    data = request.get_json()

    function_name = data['functionName']
    sender_connection = data['senderConnection']
    receiver_connection = data['receiverConnection']
    input_file = data['inputFileName']
    output_file = data['outputFileName']

    # Ensure none of these values are None before joining paths
    if None in [function_name, sender_connection, receiver_connection, input_file, output_file]:
        logging.error("One or more arguments are None. Cannot join paths.")
        return jsonify({"error": "Invalid arguments provided"}), 400

    try:
        result = function_service.run_test(
            function_name, sender_connection, receiver_connection, input_file, output_file
        )
        return jsonify(result), 200 if 'status' in result else 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@function_app.route('/api/test-results', methods=['GET'])
def list_test_results():
    try:
        test_results_dir = os.path.join(os.getcwd(), 'test-results')
        logging.error(f"Looking for JSON files in {test_results_dir}")  # Log directory path

        json_files = glob.glob(os.path.join(test_results_dir, "*.json"))
        logging.error(f"Found JSON files: {json_files}")  # Log found files

        test_results = []
        for json_file in json_files:
            with open(json_file, 'r') as file:
                data = json.load(file)
                logging.error(f"Loaded data from {json_file}: {data}")  # Log loaded data
                test_results.append(data)

        return jsonify(test_results), 200
    except Exception as e:
        logging.error(f"Error listing test results: {str(e)}")
        return jsonify({"error": str(e)}), 500