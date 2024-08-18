import json
from models.container_model import ContainerModel
from typing import List

class ContainerSerializer:
    @staticmethod
    def serialize(container: ContainerModel) -> str:
        return json.dumps(container.to_dict())

    @staticmethod
    def deserialize(container_json: str) -> ContainerModel:
        data = json.loads(container_json)
        return ContainerModel.from_dict(data)

    @staticmethod
    def serialize_list(containers: List[ContainerModel]) -> str:
        return json.dumps([container.to_dict() for container in containers])

    @staticmethod
    def deserialize_list(containers_json: str) -> List[ContainerModel]:
        data = json.loads(containers_json)
        return [ContainerModel.from_dict(container_data) for container_data in data]