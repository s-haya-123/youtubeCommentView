export class YoutubeCommentRow {
    constructor(
        public id: string,
        public message: string,
        public authorName: string,
        public tumbnails: string,
        public timestampMsec: string,
        public timestampText: string,
        public purchaseAmount: string,
        public movieId: string
    ){}
}

export interface CommentDatabase {
    getComments(movieId: string): YoutubeCommentRow[];
}

export class CommentDatabaseLocalPostgres implements CommentDatabase {
    getComments(movieId: string){
        const comment = new YoutubeCommentRow("","test","","","","","",movieId);
        return [ comment ];
    }
}