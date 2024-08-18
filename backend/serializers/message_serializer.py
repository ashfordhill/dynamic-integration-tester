import json
from models.message_model import MessageModel
from typing import List

class MessageSerializer:
    @staticmethod
    def serialize(message: MessageModel) -> str:
        return json.dumps(message.to_dict())

    @staticmethod
    def deserialize(message_json: str) -> MessageModel:
        data = json.loads(message_json)
        return MessageModel.from_dict(data)

    @staticmethod
    def serialize_list(messages: List[MessageModel]) -> str:
        return json.dumps([message.to_dict() for message in messages])

    @staticmethod
    def deserialize_list(messages_json: str) -> List[MessageModel]:
        data = json.loads(messages_json)
        return [MessageModel.from_dict(message_data) for message_data in data]