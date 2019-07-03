from abc import ABC
from abc import abstractmethod
import psycopg2
import dataclasses
from typing import List

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

class CommentDatabase(ABC):
    @abstractmethod
    def upload_comment(self, comment_data: Comment, conn: psycopg2.connect):
        pass
    def upload_comments(self, comment_datas: List[Comment], conn: psycopg2.connect):
        pass

class CommentDatabaseLocalPostgres(CommentDatabase):
    def upload_comment(self, comment_data: Comment, conn: psycopg2.connect):
        cur = conn.cursor()
        datas = (comment_data.message,comment_data.author_name,comment_data.thumbnails,comment_data.timestamp_msec,comment_data.timestamp_text,comment_data.purchase_amount,comment_data.movie_id)
        cur.execute("INSERT INTO comment(message,author_name,thumbnails,timestamp_msec,timestamp_text,purchase_amount,movie_id) VALUES (%s,%s,%s,%s,%s,%s,%s);",datas)
        conn.commit()
        cur.close()

    def upload_comments(self, comment_datas: List[Comment], conn: psycopg2.connect):
        cur = conn.cursor()
        list_data = [(comment_data.message,comment_data.author_name,comment_data.thumbnails,comment_data.timestamp_msec,comment_data.timestamp_text,comment_data.purchase_amount,comment_data.movie_id) for comment_data in comment_datas]
        cur.executemany("INSERT INTO comment(message,author_name,thumbnails,timestamp_msec,timestamp_text,purchase_amount,movie_id) VALUES (%s,%s,%s,%s,%s,%s,%s);",list_data)
        conn.commit()
        cur.close()