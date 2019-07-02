import { Client } from 'pg'; 
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
    getComments(movieId: string): Promise<YoutubeCommentRow[]>;
}

export class CommentDatabaseLocalPostgres implements CommentDatabase {
    async getComments(movieId: string): Promise<YoutubeCommentRow[]>{
        const client = await this.getPgClient();
        return this.getCommentsFromPg(client,movieId);
    }
    private async getPgClient(): Promise<Client> {
        const client = new Client({
            host: 'localhost',
            database: 'postgres',
            user: 'postgres',
            password: 'secret'
        });
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