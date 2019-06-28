import { CommentDatabase, CommentDatabaseLocalPostgres, YoutubeCommentRow, YoutubeCommentStatics } from './Comment';
export const hello = (req: any,res:any) => {
    console.log("hello ts");
    res.send();
}

export const getComment = async (req:any,res:any) => {
    const db = new CommentDatabaseLocalPostgres()
    const bin = "bin" in req.query ? Number(req.query.bin) : 30000;
    if ("movie_id" in req.query) {
        const movieId = req.query.movie_id;
        const commets = await getComments(db,movieId);
        const statics = takeStaticsOfComment(commets,bin, true);
        res.status(200).send(statics);
    } else  {
        res.status(400).end();
    }
}

async function getComments(db: CommentDatabase ,movieId: string): Promise<YoutubeCommentRow[]> {
    return db.getComments(movieId);
}

function　takeStaticsOfComment(comments: YoutubeCommentRow[], bin: number, isExcludeBeforeComment: boolean) {
    const binRange = calcBinRange(comments,bin);
    const results = new Array(binRange).fill(0);
    return comments.reduce((acc: number[],comment: YoutubeCommentRow) => {
        if (isExcludeBeforeComment && comment.timestampMsec === 0) {
            return acc;
        } else {
            const index = Math.floor(comment.timestampMsec / bin);
            acc[index] += 1;
            return acc;
        }
    }, results).map((commentNumber,index)=>{
        const seconds = Math.floor(bin / 1000) * (index + 1);
        const label = `${Math.floor(seconds / 60)}:${seconds % 60}`;
        return new YoutubeCommentStatics(commentNumber,label,seconds);
    });
}
function calcBinRange(comments: YoutubeCommentRow[], binMsec: number): number {
    const maxTimestamp:number = comments.slice(-1)[0].timestampMsec;
    return Math.floor(maxTimestamp / binMsec) + 1;
}