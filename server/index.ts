import { CommentDatabase, CommentDatabasePostgres, YoutubeCommentRow, YoutubeCommentStatics } from './Comment';
import { Movie, MovieDatabase, MovieDatabasePostgres } from './Movie';
import { PoolConfig, Pool, Client } from 'pg';

const connectionName = process.env.INSTANCE_CONNECTION_NAME;
const dbUser = process.env.SQL_USER || "postgres";
const dbPassword = process.env.SQL_PASSWORD || "secret";
const dbName = process.env.SQL_NAM || "postgres";
const pgConfig: PoolConfig = {
    max: 1,
    user: dbUser,
    password: dbPassword,
    database: dbName,
    host: connectionName ? `/cloudsql/${connectionName}` : "localhost"
};

let client: Client | null = null;

export const getComment = async (req:any,res:any) => {
    const db = new CommentDatabasePostgres();
    if (!client) {
        client = await db.getPgClient(pgConfig);
    }
    const bin = "bin" in req.query ? Number(req.query.bin) : 30000;
    if ("movie_id" in req.query) {
        const movieId = req.query.movie_id;
        const commets = await getComments(db,client,movieId);
        const statics = takeStaticsOfComment(commets,bin, true);
        res.header('Access-Control-Allow-Origin', "*");
        res.status(200).send(statics);
    } else  {
        res.status(400).end();
    }
}
export const getMovie = async (req:any,res:any) => {
    const db = new MovieDatabasePostgres();
    if (!client) {
        client = await db.getPgClient(pgConfig);
    }
    const movies = await getAllMovies(db, client);
    res.header('Access-Control-Allow-Origin', "*");
    res.status(200).send(movies);
}
async function getAllMovies(db: MovieDatabase, client: Client): Promise<Movie[]> {
    return db.getAllMovies(client);
}

async function getComments(db: CommentDatabase,client:Client ,movieId: string): Promise<YoutubeCommentRow[]> {
    return db.getComments(client,movieId);
}

function　takeStaticsOfComment(comments: YoutubeCommentRow[], bin: number, isExcludeBeforeComment: boolean):YoutubeCommentStatics[] {
    const binRange = calcBinRange(comments,bin);
    const results: YoutubeCommentStatics[] = new Array(binRange).fill({}).map( (_)=> {return new YoutubeCommentStatics(0,"",0,[]) } );
    const takeStatics: (arg1: YoutubeCommentStatics[], arg2: YoutubeCommentRow)=>YoutubeCommentStatics[]
        = (acc,comment)=>{
            if (isExcludeBeforeComment && comment.timestampMsec === 0) {
                return acc;
            } else {
                const index = Math.floor(comment.timestampMsec / bin);
                const target = acc[index];
                target.commentNumber += 1;
                target.messages.push(comment.message);
                return acc;
            }
    }
    const mapStatics: (arg1: YoutubeCommentStatics, arg2: number)=> YoutubeCommentStatics
        = (commentStatics,index) =>{
            const seconds = Math.floor(bin / 1000) * index;
            const secondsText = `0${seconds % 60}`.slice(-2);
            const label = `${Math.floor(seconds / 60)}:${secondsText}`;
            commentStatics.second = seconds;
            commentStatics.label = label
            return commentStatics;
        }
    return comments.reduce(takeStatics, results).map(mapStatics);
}
function calcBinRange(comments: YoutubeCommentRow[], binMsec: number): number {
    const maxTimestamp:number = comments.slice(-1)[0].timestampMsec;
    return Math.floor(maxTimestamp / binMsec) + 1;
}