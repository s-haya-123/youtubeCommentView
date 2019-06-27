import { CommentDatabase, CommentDatabaseLocalPostgres, YoutubeCommentRow } from './Comment';
export const hello = (req: any,res:any) => {
    console.log("hello ts");
    res.send();
}

export const getComment = async (req:any,res:any) => {
    const db = new CommentDatabaseLocalPostgres()
    const movieId = req.query.movie_id;
    const commets = getComments(db,movieId);
    res.status(200).send(commets);
}

function getComments(db: CommentDatabase ,movieId: string): YoutubeCommentRow[] {
    return db.getComments(movieId);
}