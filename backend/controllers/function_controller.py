import os
import glob
import json
from flask import Blueprint, request, jsonify
from services.function_service import FunctionService
import logging 
import uuid  # Import the uuid module

function_app = Blueprint('function_app', __name__)
function_service = FunctionService()
UPLOADS_DIRECTORY = os.path.join(os.getcwd(), 'uploads')
TEST_CASE_IDS_FILE = os.path.join(os.getcwd(), 'uploads', 'test_case_ids.json')  # Define the file to store test case IDs

# Ensure uploads directories exist
os.makedirs(os.path.join(UPLOADS_DIRECTORY, 'inputs'), exist_ok=True)
os.makedirs(os.path.join(UPLOADS_DIRECTORY, 'outputs'), exist_ok=True)

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


    test_case_id = data['testCaseId']
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
            test_case_id, function_name, sender_connection, receiver_connection, input_file, output_file
        )
        return jsonify(result), 200 if 'status' in result else 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@function_app.route('/api/test-results', methods=['GET'])
def list_test_results():
    try:
        test_results_dir = os.path.join(os.getcwd(), 'test-results')
        logging.debug(f"Looking for JSON files in {test_results_dir}")  # Log directory path

        json_files = glob.glob(os.path.join(test_results_dir, "*.json"))
        logging.debug(f"Found JSON files: {json_files}")  # Log found files

        test_results = []
        for json_file in json_files:
            with open(json_file, 'r') as file:
                data = json.load(file)
                logging.debug(f"Loaded data from {json_file}: {data}")  # Log loaded data
                test_results.append(data)

        return jsonify(test_results), 200
    except Exception as e:
        logging.error(f"Error listing test results: {str(e)}")
        return jsonify({"error": str(e)}), 500

@function_app.route('/api/upload-test-case-resources', methods=['POST'])
def upload_test_case_resources():
    try:
        input_file = request.files.get('inputFile')
        output_file = request.files.get('outputFile')
        function_name = request.form.get('functionName')

        if not input_file or not function_name:
            return jsonify({"error": "Input file and function name are required"}), 400

        # Save the input file
        input_filename = input_file.filename
        input_file_path = os.path.join(UPLOADS_DIRECTORY, 'inputs', input_filename)
        input_file.save(input_file_path)

        # Save the output file if provided
        output_filename = None
        if output_file:
            output_filename = output_file.filename
            output_file_path = os.path.join(UPLOADS_DIRECTORY, 'outputs', output_filename)
            output_file.save(output_file_path)

        # Generate a new test case ID
        test_case_id = str(uuid.uuid4())  # Ensure UUID is a string

        # Persist the test case ID to the file
        if not os.path.exists(TEST_CASE_IDS_FILE):
            # If the file doesn't exist, create an empty JSON array
            with open(TEST_CASE_IDS_FILE, 'w') as file:
                json.dump([], file)

        # Read the existing test case IDs from the file
        with open(TEST_CASE_IDS_FILE, 'r') as file:
            test_case_ids = json.load(file)

        # Append the new test case ID
        test_case_ids.append(test_case_id)

        # Write the updated test case IDs back to the file
        with open(TEST_CASE_IDS_FILE, 'w') as file:
            json.dump(test_case_ids, file, indent=2)

        return jsonify({
            "testCaseId": test_case_id,
            "inputFileName": input_filename,
            "outputFileName": output_filename,
            "functionName": function_name
        }), 200

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500  
 
@function_app.route('/api/save-test-result', methods=['POST'])
def save_test_result():
    data = request.get_json()
    return function_service.save_test_result(data)