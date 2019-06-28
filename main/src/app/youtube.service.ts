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
  private data:CommentData[] = [
    new CommentData(12,"0:30",30),
    new CommentData(19,"1:00",60),
    new CommentData(3,"1:30",90),
    new CommentData(5,"2:00",120),
    new CommentData(3,"2:30",150),
  ]
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
}
