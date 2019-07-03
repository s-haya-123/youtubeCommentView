from abc import ABC
from abc import abstractmethod
import psycopg2
import dataclasses

@dataclasses.dataclass
class Movie:
    id: str
    title: str

class MovieDatabase(ABC):
    @abstractmethod
    def upload_movie(self, movie: Movie):
        pass

class MovieDatabaseLocalPostgres(MovieDatabase):
    def upload_movie(self, movie: Movie, conn:psycopg2.connect):
        cur = conn.cursor()
        datas = (movie.id, movie.title)
        cur.execute("INSERT INTO movie(id,title) VALUES (%s,%s);",datas)
        conn.commit()
