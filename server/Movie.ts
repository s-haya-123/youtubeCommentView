import { Client, PoolConfig } from 'pg'; 
export class Movie {
    constructor(
        public id: string,
        public title: string,
        public commentCount?: number
    ){}
}

export interface MovieDatabase {
    getAllMovies(client:Client): Promise<Movie[]>
}

export class MovieDatabasePostgres implements MovieDatabase {
    async getAllMovies(client:Client): Promise<Movie[]> {
        return this.getMoviesFromPg(client);
    }
    async getPgClient(config: PoolConfig): Promise<Client> {
        const client = new Client(config);
        await client.connect();
        return client;
    }
    private async getMoviesFromPg(client: Client):Promise<Movie[]> {
        const result = await client.query(`SELECT * FROM movie;`);
        return result.rows.map((row)=>{
            return new Movie(row["id"], row["title"]);
        });
    }
}
