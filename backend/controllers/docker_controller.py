from flask import Blueprint, request, jsonify
from services.docker_service import DockerService
import logging
import subprocess
import tempfile
import os

docker_app = Blueprint('docker_app', __name__)
docker_service = DockerService()

@docker_app.route('/api/docker/container-statuses', methods=['GET'])
def get_container_statuses():
    try:
        running_containers = docker_service.client.containers.list(all=True)
        container_statuses = {container.id: {"name": container.name, "status": container.status} for container in running_containers}
        return jsonify({"status": "success", "statuses": container_statuses}), 200
    except Exception as e:
        error_message = f"Error retrieving container statuses: {str(e)}"
        logging.error(error_message)
        return jsonify({"error": error_message}), 500

@docker_app.route('/api/docker/start-containers', methods=['POST'])
def start_containers():
    containers = request.json.get('containers', [])
    try:
        result = docker_service.start_all_containers(containers)
        return jsonify({"status": "success", "output": result["output"], "statuses": result["statuses"]}), 200
    except Exception as e:
        error_message = f"Error starting containers: {str(e)}"
        logging.error(error_message)
        return jsonify({"error": error_message}), 500

@docker_app.route('/api/docker/stop-containers', methods=['POST'])
def stop_containers():
    containers = request.json.get('containers', [])
    try:
        output = docker_service.stop_all_containers(containers)
        return jsonify({"status": "success", "output": output}), 200
    except Exception as e:
        error_message = f"Error stopping containers: {str(e)}"
        logging.error(error_message)
        return jsonify({"error": error_message}), 500

@docker_app.route('/api/docker/export-compose', methods=['POST'])
def export_compose():
    containers = request.json['containers']
    try:
        compose_content = docker_service.generate_compose_file(containers)
        with open('docker-compose.yml', 'w') as file:
            file.write(compose_content)
        return jsonify({"status": "success", "message": "docker-compose.yml saved successfully."}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@docker_app.route('/import-compose', methods=['POST'])
def import_compose():
    if 'file' not in request.files:
        return jsonify({"error": "No file provided"}), 400

    file = request.files['file']
    file_path = os.path.join('/tmp', file.filename)

    try:
        file.save(file_path)
        containers = docker_service.import_docker_compose(file_path)
        return jsonify(containers)
    except Exception as e:
        logging.error(f"Error importing Docker Compose file: {str(e)}")
        return jsonify({"error": "Failed to import Docker Compose file"}), 500

@docker_app.route('/api/execute-script', methods=['POST'])
def execute_script():
    script_content = request.json.get('script')
    
    if not script_content:
        return jsonify({"error": "No script content provided"}), 400

    try:
        # Save the script to a temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix=".py") as temp_script:
            temp_script.write(script_content.encode())
            temp_script_path = temp_script.name

        # Execute the script and capture output
        result = subprocess.run(
            ['python', temp_script_path],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )

        os.remove(temp_script_path)

        return jsonify({
            "output": result.stdout,
            "error": result.stderr
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500