from typing import Dict

class FunctionModel:
    def __init__(self, name: str, code: str):
        self.name = name
        self.code = code

    def to_dict(self) -> Dict:
        return {
            'name': self.name,
            'code': self.code
        }

    @classmethod
    def from_dict(cls, data: Dict):
        return cls(
            name=data['name'],
            code=data['code']
        )