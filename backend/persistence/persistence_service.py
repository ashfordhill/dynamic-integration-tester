import os
import json
from typing import List
from models.container_model import ContainerModel
from serializers.container_serializer import ContainerSerializer
from models.function_model import FunctionModel
from serializers.function_serializer import FunctionSerializer
from models.message_model import MessageModel
from serializers.message_serializer import MessageSerializer

class PersistenceService:
    def __init__(self, storage_dir: str = './storage'):
        self.storage_dir = storage_dir
        if not os.path.exists(self.storage_dir):
            os.makedirs(self.storage_dir)

    def save_containers(self, containers: List[ContainerModel], filename: str):
        file_path = os.path.join(self.storage_dir, filename)
        with open(file_path, 'w') as file:
            file.write(ContainerSerializer.serialize_list(containers))

    def load_containers(self, filename: str) -> List[ContainerModel]:
        file_path = os.path.join(self.storage_dir, filename)
        if not os.path.exists(file_path):
            return []
        with open(file_path, 'r') as file:
            containers_json = file.read()
        return ContainerSerializer.deserialize_list(containers_json)

    def save_function(self, function: FunctionModel, filename: str):
        file_path = os.path.join(self.storage_dir, filename)
        with open(file_path, 'w') as file:
            file.write(FunctionSerializer.serialize(function))

    def load_function(self, filename: str) -> FunctionModel:
        file_path = os.path.join(self.storage_dir, filename)
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"Function file {filename} not found.")
        with open(file_path, 'r') as file:
            function_json = file.read()
        return FunctionSerializer.deserialize(function_json)
        
    def save_message(self, message: MessageModel, filename: str):
        file_path = os.path.join(self.storage_dir, filename)
        with open(file_path, 'w') as file:
            file.write(MessageSerializer.serialize(message))

    def load_message(self, filename: str) -> MessageModel:
        file_path = os.path.join(self.storage_dir, filename)
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"Message file {filename} not found.")
        with open(file_path, 'r') as file:
            message_json = file.read()
        return MessageSerializer.deserialize(message_json)