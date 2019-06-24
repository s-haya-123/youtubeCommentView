import dataclasses

@dataclasses.dataclass
class Comment:
    id: str
    message: str
    author_name: str
    thumbnails: str
    timestamp_msec: str
    timestamp_text: str
    purcahse_amount: str