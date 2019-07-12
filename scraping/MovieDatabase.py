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
    def select_movies(self):
        pass

class MovieDatabaseLocalPostgres(MovieDatabase):
    def upload_movie(self, movie: Movie, conn:psycopg2.connect):
        cur = conn.cursor()
        datas = (movie.id, movie.title)
        cur.execute("INSERT INTO movie(id,title) VALUES (%s,%s);",datas)
        conn.commit()
    def select_movies(self, conn:psycopg2.connect):
        cur = conn.cursor()
        cur.execute("SELECT id FROM movie;")
        rows = cur.fetchall()
        conn.commit()
        return list(map(lambda x: x[0],rows))

