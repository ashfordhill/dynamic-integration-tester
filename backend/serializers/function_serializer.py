import json
from models.function_model import FunctionModel
from typing import List

class FunctionSerializer:
    @staticmethod
    def serialize(function: FunctionModel) -> str:
        return json.dumps(function.to_dict())

    @staticmethod
    def deserialize(function_json: str) -> FunctionModel:
        data = json.loads(function_json)
        return FunctionModel.from_dict(data)

    @staticmethod
    def serialize_list(functions: List[FunctionModel]) -> str:
        return json.dumps([function.to_dict() for function in functions])

    @staticmethod
    def deserialize_list(functions_json: str) -> List[FunctionModel]:
        data = json.loads(functions_json)
        return [FunctionModel.from_dict(function_data) for function_data in data]