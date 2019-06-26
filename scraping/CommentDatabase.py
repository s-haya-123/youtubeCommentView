from abc import ABC
from abc import abstractmethod
from Comment import Comment
import psycopg2

class CommentDatabase(ABC):
    @abstractmethod
    def upload_comment(self, comment_data: Comment):
        pass

class CommentDatabaseLocalPostgres(CommentDatabase):
    def upload_comment(self, comment_data: Comment):
        conn = psycopg2.connect("host=localhost port=5432 dbname=postgres user=postgres password=secret")
        cur = conn.cursor()
        datas = (comment_data.message,comment_data.author_name,comment_data.thumbnails,comment_data.timestamp_msec,comment_data.timestamp_text,comment_data.purcahse_amount)
        cur.execute("INSERT INTO comment(message,author_name,thumbnails,timestamp_msec,timestamp_text,purchase_amount) VALUES (%s,%s,%s,%s,%s,%s);",datas)
        conn.commit()
        cur.close()
        conn.close()

class CommentDatabaseCloudFunc(CommentDatabase):
    def upload_comment(self, comment_data: Comment):
        print("test")