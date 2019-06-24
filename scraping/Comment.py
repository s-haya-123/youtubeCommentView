import dataclasses

@dataclasses.dataclass
class Comment:
    id: str
    message: str
    author_name: str
    thumbnails: str
    timestamp: str
    timestampText: str
    purcahse_amount: str