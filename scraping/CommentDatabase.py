from abc import ABC
from abc import abstractmethod
from Comment import Comment

class CommentDatabase(ABC):
    @abstractmethod
    def upload_comment(self, comment_data: Comment):
        pass

class CommentDatabaseLocalPostgres(CommentDatabase):
    def upload_comment(self, comment_data: Comment):
        print()

class CommentDatabaseCloudFunc(CommentDatabase):
    def upload_comment(self, comment_data: Comment):
        print("test")