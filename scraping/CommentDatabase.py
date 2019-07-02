from abc import ABC
from abc import abstractmethod
import psycopg2
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

class CommentDatabase(ABC):
    @abstractmethod
    def upload_comment(self, comment_data: Comment):
        pass

class CommentDatabaseLocalPostgres(CommentDatabase):
    def upload_comment(self, comment_data: Comment):
        conn = psycopg2.connect("host=localhost port=5432 dbname=postgres user=postgres password=secret")
        cur = conn.cursor()
        datas = (comment_data.message,comment_data.author_name,comment_data.thumbnails,comment_data.timestamp_msec,comment_data.timestamp_text,comment_data.purchase_amount,comment_data.movie_id)
        cur.execute("INSERT INTO comment(message,author_name,thumbnails,timestamp_msec,timestamp_text,purchase_amount,movie_id) VALUES (%s,%s,%s,%s,%s,%s,%s);",datas)
        conn.commit()
        cur.close()
        conn.close()

class CommentDatabaseCloudFunc(CommentDatabase):
    def upload_comment(self, comment_data: Comment):
        print("test")