import { Client, PoolConfig } from 'pg'; 
export class YoutubeCommentRow {
    constructor(
        public id: string,
        public message: string,
        public authorName: string,
        public tumbnails: string,
        public timestampMsec: number,
        public timestampText: string,
        public purchaseAmount: string,
        public movieId: string
    ){}
}
export class YoutubeCommentStatics {
    constructor(
        public commentNumber: number,
        public label: string,
        public second: number,
        public messages: string[]
    ){}
}

export interface CommentDatabase {
    getComments(client:Client, movieId: string): Promise<YoutubeCommentRow[]>;
}

export class CommentDatabasePostgres implements CommentDatabase {
    async getComments(client: Client, movieId: string): Promise<YoutubeCommentRow[]>{
        return this.getCommentsFromPg(client,movieId);
    }
    async getPgClient(config: PoolConfig): Promise<Client> {
        const client = new Client(config);
        await client.connect();
        return client;
    }
    private async getCommentsFromPg(client: Client, movieId: string):Promise<YoutubeCommentRow[]> {
        const result = await client.query(`SELECT * FROM comment WHERE movie_id='${movieId}' order by timestamp_msec asc`);
        return result.rows.map((row)=>{
            return new YoutubeCommentRow(row["id"],row["message"],row["author_name"],row["thumbnails"],row["timestamp_msec"],row["timestamp_text"],row["purchase_amount"],row["movie_id"]);
        });
    }
}