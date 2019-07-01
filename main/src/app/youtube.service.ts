import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

export class CommentData {
  constructor(
    public commentNumber: number,
    public label: string,
    public second: number
    ) {}
}

export class YoutubeData {
  constructor(
    public title: string,
    public id:String,
  ) {}
}

@Injectable({
  providedIn: 'root'
})
export class YoutubeService {
  private youtubeData: YoutubeData = new YoutubeData("OUTLASTから逃げるな【#5】","juRmM7oa2Jg")
  constructor(private http:HttpClient) { }

  getYoutubeData(): Observable<YoutubeData> {
    return new Observable((observer)=>{
      observer.next(this.youtubeData);
      return {unsubscribe() {}};
    })
  }
  getYoutubeComment(id: string, bin: number): Observable<CommentData[]> {
    return new Observable( (obserber)=>{
      this.http.get(`http://localhost:8010/tensile-pixel-243512/us-central1/getComment?bin=${bin}\&movie_id=${id}`)
      .subscribe((datas: Array<any>)=>{
        const commentDatas = datas.map(data=>{
          return new CommentData(data["commentNumber"], data["label"], data["second"]);
        });
        obserber.next(commentDatas);
      })
    });
  }
  getAllMovie(): Observable<YoutubeData[]> {
    return new Observable( (observer)=>{
      this.http.get("http://localhost:8010/tensile-pixel-243512/us-central1/getMovie")
      .subscribe((datas: Array<any>)=>{
        const youtubeData = datas.map(data=>{
          return new YoutubeData(data["title"],data["id"]);
        });
        observer.next(youtubeData);
      })
    });
  }
}
