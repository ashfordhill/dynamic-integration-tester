import docker
import yaml
import logging
import subprocess
import os
from tempfile import TemporaryDirectory

class DockerService:
    def __init__(self):
        self.client = docker.from_env()

    def generate_compose_file_content(self, containers):
        compose_dict = {
            'version': '3.8',
            'services': {}
        }
        for container in containers:
            compose_dict['services'][container['name']] = {
                'image': container['image'],
                'ports': container['ports'],
                'environment': container['environment'],
                'volumes': container['volumes'],
                'networks': [container['network']],
            }
        return yaml.dump(compose_dict)

    def start_all_containers(self, containers):
        with TemporaryDirectory() as temp_dir:
            compose_file_path = os.path.join(temp_dir, 'docker-compose.yml')
            compose_content = self.generate_compose_file_content(containers)
            
            with open(compose_file_path, 'w') as compose_file:
                compose_file.write(compose_content)

            try:
                # Run `docker-compose up` in the temporary directory
                result = subprocess.run(
                    ['docker-compose', '-f', compose_file_path, 'up', '-d'],
                    check=True,
                    stdout=subprocess.PIPE,
                    stderr=subprocess.PIPE
                )

                # After starting, check container statuses
                running_containers = self.client.containers.list()
                container_statuses = {container.id: {'name': container.name, 'status': container.status} for container in running_containers}

                return {"output": result.stdout.decode('utf-8'), "statuses": container_statuses}

            except subprocess.CalledProcessError as e:
                error_message = f"Error running docker-compose up: {e.stderr.decode('utf-8')}"
                logging.error(error_message)
                raise Exception(error_message)

    def stop_all_containers(self, containers):
        with TemporaryDirectory() as temp_dir:
            compose_file_path = os.path.join(temp_dir, 'docker-compose.yml')
            compose_content = self.generate_compose_file_content(containers)
            
            with open(compose_file_path, 'w') as compose_file:
                compose_file.write(compose_content)

            try:
                # Run `docker-compose down` in the temporary directory
                result = subprocess.run(
                    ['docker-compose', '-f', compose_file_path, 'down'],
                    check=True,
                    stdout=subprocess.PIPE,
                    stderr=subprocess.PIPE
                )
                return result.stdout.decode('utf-8')
            except subprocess.CalledProcessError as e:
                error_message = f"Error running docker-compose down: {e.stderr.decode('utf-8')}"
                logging.error(error_message)
                raise Exception(error_message)
