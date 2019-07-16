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
    const staticsFunc = (comments: YoutubeCommentRow[],bin: number):YoutubeCommentStatics[] =>{
        return takeStaticsOfComment(comments,bin,true);
    }
    getCommentSectStatics(req,res,staticsFunc);
}
export const getCommentBurst = async (req:any, res: any) =>{
    const staticsFunc = (comments: YoutubeCommentRow[],bin: number):YoutubeCommentStatics[] =>{
        return takeStaticsOfCommentFromDifferential(comments,bin,4);
    }
    getCommentSectStatics(req,res,staticsFunc);
}
async function getCommentSectStatics(req:any, res:any, staticsFunction: (comments: YoutubeCommentRow[],bin: number)=>YoutubeCommentStatics[]) {
    const db = new CommentDatabasePostgres();
    if (!client) {
        client = await db.getPgClient(pgConfig);
    }
    const bin = "bin" in req.query ? Number(req.query.bin) : 30000;
    if ("movie_id" in req.query) {
        const movieId = req.query.movie_id;
        const comments = await getComments(db,client,movieId);
        const statics = staticsFunction(comments,bin);
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
function takeStaticsOfCommentFromDifferential(comments: YoutubeCommentRow[], range: number, threshold: number): YoutubeCommentStatics[] {
    const differentialComment = (sec: number) =>{
        const rangeComments = comments
            .filter((value)=> value.timestampMsec >= sec * 1000 && value.timestampMsec < sec * 1000 + range)
            .map((value)=>value.message);

        const secondsText = `0${sec % 60}`.slice(-2);
        const label = `${Math.floor(sec / 60)}:${secondsText}`;
        return new YoutubeCommentStatics(rangeComments.length,label,sec,rangeComments);
    }
    const maxSec = Math.floor(comments.slice(-1)[0].timestampMsec / 1000);
    const rangeArray = [...Array(maxSec).keys()].slice(1); // range 1..maxSec
    
    return rangeArray.map(differentialComment)
        .filter((value)=>{
            const dComment = value.messages.length / range * 1000;
            return dComment >= threshold
        }).reduce((array: YoutubeCommentStatics[],current:YoutubeCommentStatics)=>{
            const index = array.findIndex((value)=>value.second > current.second - range / 1000 && value.second < current.second + range / 1000);
            if ( index >= 0 && current.commentNumber > array[index].commentNumber) {
                array.splice(index,1,current);
            } else if(index < 0) {
                array.push(current);
            }
            return array;
        },[]);
}
function calcBinRange(comments: YoutubeCommentRow[], binMsec: number): number {
    const maxTimestamp:number = comments.slice(-1)[0].timestampMsec;
    return Math.floor(maxTimestamp / binMsec) + 1;
}