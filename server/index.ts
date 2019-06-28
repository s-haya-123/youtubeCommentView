import { CommentDatabase, CommentDatabaseLocalPostgres, YoutubeCommentRow } from './Comment';
export const hello = (req: any,res:any) => {
    console.log("hello ts");
    res.send();
}

export const getComment = async (req:any,res:any) => {
    const db = new CommentDatabaseLocalPostgres()
    const movieId = req.query.movie_id;
    const bin = "bin" in req.query ? Number(req.query.bin) : 30000;
    const commets = await getComments(db,movieId);
    const statics = takeStaticsOfComment(commets,bin);
    res.status(200).send(statics);
}

async function getComments(db: CommentDatabase ,movieId: string): Promise<YoutubeCommentRow[]> {
    return db.getComments(movieId);
}

function　takeStaticsOfComment(comments: YoutubeCommentRow[], bin: number) {
    const binRange = calcBinRange(comments,bin);
    const results = new Array(binRange).fill(0);
    return comments.reduce((acc: number[],comment: YoutubeCommentRow) => {
        const index = Math.floor(Number(comment.timestampMsec) / bin);
        acc[index] += 1;
        return acc;
    }, results);
}
function calcBinRange(comments: YoutubeCommentRow[], binMsec: number): number {
    const maxTimestamp = Number(comments.slice(-1)[0].timestampMsec);
    return Math.floor(maxTimestamp / binMsec) + 1;
}