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

# Upload and serialize docker-compose file
@docker_app.route('/api/docker/upload-compose', methods=['POST'])
def upload_compose():
    try:
        # Get the uploaded file
        compose_file = request.files['file']
        
        # Use a known temp directory to avoid issues
        temp_dir = tempfile.mkdtemp()
        compose_file_path = os.path.join(temp_dir, 'docker-compose.yml')

        # Save the uploaded file
        compose_file.save(compose_file_path)

        # Read and parse the compose file
        with open(compose_file_path, 'r') as f:
            file_content = f.read()

        compose_data = docker_service.parse_compose(file_content, compose_file_path)
        return jsonify({"status": "success", "compose": compose_data}), 200
    except Exception as e:
        logging.error(f"Error parsing docker-compose file: {str(e)}")
        return jsonify({"error": str(e)}), 500

# Edit the docker-compose fields
@docker_app.route('/api/docker/edit-compose', methods=['POST'])
def edit_compose():
    try:
        new_compose_data = request.json  # The updated compose data from UI
        updated_compose = docker_service.update_compose(new_compose_data)
        return jsonify({"status": "success", "updated_compose": updated_compose}), 200
    except Exception as e:
        logging.error(f"Error updating docker-compose: {str(e)}")
        return jsonify({"error": str(e)}), 500

# Export the current docker-compose file
@docker_app.route('/api/docker/export-compose', methods=['GET'])
def export_compose():
    try:
        compose_data = docker_service.get_current_compose()  # Get current compose
        temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.yml')
        with open(temp_file.name, 'w') as f:
            f.write(compose_data)

        return send_file(temp_file.name, as_attachment=True, download_name='docker-compose.yml')
    except Exception as e:
        logging.error(f"Error exporting docker-compose: {str(e)}")
        return jsonify({"error": str(e)}), 500

# Run docker-compose file
@docker_app.route('/api/docker/run-compose', methods=['POST'])
def run_compose():
    try:
        container_details = docker_service.run_compose()
        return jsonify({"status": "success", "containers": container_details}), 200
    except Exception as e:
        logging.error(f"Error running docker-compose: {str(e)}")
        return jsonify({"error": str(e)}), 500

# Stop a running container
@docker_app.route('/api/docker/stop-container/<string:container_id>', methods=['POST'])
def stop_container(container_id):
    try:
        docker_service.stop_container(container_id)
        return jsonify({"status": "success", "message": f"Container {container_id} stopped"}), 200
    except Exception as e:
        logging.error(f"Error stopping container {container_id}: {str(e)}")
        return jsonify({"error": str(e)}), 500

# Start all containers from the compose file and return the container details
@docker_app.route('/api/docker/start-containers', methods=['POST'])
def start_containers():
    try:
        container_details = docker_service.start_compose()  # Get container details after starting
        return jsonify({"status": "success", "containers": container_details}), 200
    except Exception as e:
        logging.error(f"Error starting containers: {str(e)}")
        return jsonify({"error": str(e)}), 500

# Fetch container logs
@docker_app.route('/api/docker/container-logs/<string:container_id>', methods=['GET'])
def container_logs(container_id):
    try:
        logs = docker_service.get_container_logs(container_id)
        return jsonify({"status": "success", "logs": logs}), 200
    except Exception as e:
        logging.error(f"Error fetching logs for container {container_id}: {str(e)}")
        return jsonify({"error": str(e)}), 500