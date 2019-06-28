import dataclasses

@dataclasses.dataclass
class Comment:
    id: str
    message: str
    author_name: str
    thumbnails: str
    timestamp_msec: int
    timestamp_text: str
    purchase_amount: str
    movie_id: str