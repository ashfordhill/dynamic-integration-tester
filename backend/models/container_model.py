from typing import List, Dict

class ContainerModel:
    def __init__(self, container_id: str, name: str, image: str, ports: List[Dict], env: List[str], volumes: List[Dict], privileged: bool):
        self.container_id = container_id
        self.name = name
        self.image = image
        self.ports = ports
        self.env = env
        self.volumes = volumes
        self.privileged = privileged

    def to_dict(self) -> Dict:
        return {
            'container_id': self.container_id,
            'name': self.name,
            'image': self.image,
            'ports': self.ports,
            'env': self.env,
            'volumes': self.volumes,
            'privileged': self.privileged
        }

    @classmethod
    def from_dict(cls, data: Dict):
        return cls(
            container_id=data['container_id'],
            name=data['name'],
            image=data['image'],
            ports=data['ports'],
            env=data['env'],
            volumes=data['volumes'],
            privileged=data['privileged']
        )