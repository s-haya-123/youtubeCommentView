import { Client } from 'pg'; 
export class Movie {
    constructor(
        public id: string,
        public title: string
    ){}
}

export interface MovieDatabase {
    getAllMovies(): Promise<Movie[]>
}

export class MovieDatabaseLocalPostgres implements MovieDatabase {
    async getAllMovies(): Promise<Movie[]> {
        const client = await this.getPgClient();
        return this.getMoviesFromPg(client);
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
    private async getMoviesFromPg(client: Client):Promise<Movie[]> {
        const result = await client.query(`SELECT * FROM movie;`);
        return result.rows.map((row)=>{
            return new Movie(row["id"], row["title"]);
        });
    }
}