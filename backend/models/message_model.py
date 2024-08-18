from typing import Dict

class MessageModel:
    def __init__(self, content: str, metadata: Dict[str, Any]):
        self.content = content
        self.metadata = metadata

    def to_dict(self) -> Dict:
        return {
            'content': self.content,
            'metadata': self.metadata
        }

    @classmethod
    def from_dict(cls, data: Dict):
        return cls(
            content=data['content'],
            metadata=data['metadata']
        )