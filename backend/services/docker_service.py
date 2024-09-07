import docker
import yaml
import logging
import os
import subprocess

class DockerService:
    def __init__(self):
        self.client = docker.from_env()
        self.compose_file_path = None  # Initialize with no path

    def parse_compose(self, compose_content, file_path):
        """
        Parse the docker-compose YAML file and set the file path.
        """
        try:
            compose_data = yaml.safe_load(compose_content)
            self.compose_file_path = file_path  # Save the path for later use
            return compose_data
        except Exception as e:
            logging.error(f"Error parsing compose file: {str(e)}")
            raise e

    def run_compose(self):
        """
        Run docker-compose up using the uploaded compose file and return container details.
        """
        try:
            if not self.compose_file_path:
                raise Exception("No compose file uploaded")
            
            # Run docker-compose up
            subprocess.run(['docker-compose', '-f', self.compose_file_path, 'up', '-d'], check=True)
            
            # Retrieve the list of running containers
            running_containers = self.client.containers.list()
            container_details = []
            
            for container in running_containers:
                # Filter containers related to the current compose (optional logic could be added here)
                container_details.append({
                    "id": container.id,
                    "name": container.name,
                    "status": container.status
                })
            
            # Return details about the running containers so the frontend can use them
            return container_details

        except Exception as e:
            logging.error(f"Error running docker-compose: {str(e)}")
            raise e

    def stop_container(self, container_id):
        """
        Stop a container by ID.
        """
        try:
            container = self.client.containers.get(container_id)
            container.stop()
        except Exception as e:
            logging.error(f"Error stopping container {container_id}: {str(e)}")
            raise e

    def start_compose(self):
        if not self.compose_file_path:
            raise Exception("No compose file uploaded")

        try:
            # Run docker-compose up to start all services in the compose file
            subprocess.run(['docker-compose', '-f', self.compose_file_path, 'up', '-d'], check=True)
            logging.info(f"Started all containers from compose file {self.compose_file_path}")
            
            # Retrieve the list of running containers from Docker
            running_containers = self.client.containers.list()
            container_details = []

            for container in running_containers:
                # Inspect the container and map it to the service name
                service_name = container.attrs['Config']['Labels'].get('com.docker.compose.service')
                
                # Add container ID and service name to the response
                container_details.append({
                    "service_name": service_name,
                    "container_id": container.id,
                    "container_name": container.name,
                    "status": container.status
                })

            return container_details  # Return the list of containers mapped to their services

        except Exception as e:
            logging.error(f"Error starting containers from docker-compose: {str(e)}")
            raise e

    def get_container_logs(self, container_id):
        """
        Get the logs of a container by ID.
        """
        try:
            container = self.client.containers.get(container_id)
            return container.logs().decode('utf-8')
        except Exception as e:
            logging.error(f"Error fetching logs for container {container_id}: {str(e)}")
            raise e
