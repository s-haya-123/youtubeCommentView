import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from './../environments/environment';

export class CommentData {
  constructor(
    public commentNumber: number,
    public label: string,
    public second: number,
    public messages: string[]
    ) {}
}

export class YoutubeData {
  constructor(
    public title: string,
    public id: String,
    public count: number
  ) {}
}

@Injectable({
  providedIn: 'root'
})
export class YoutubeService {
  youtubeData: YoutubeData;
  constructor(private http:HttpClient) {  }

  getYoutubeData(): YoutubeData {
    return this.youtubeData;
  }
  getYoutubeCommentBurst(id: string, bin: number): Observable<CommentData[]> {
    return this.getYoutubeComment(id,bin,"getCommentBurst");
  }
  getYoutubeCommentInterval(id: string, bin: number): Observable<CommentData[]> {
    return this.getYoutubeComment(id,bin,"getComment");
  }
  private getYoutubeComment(id: string, bin: number, url: string): Observable<CommentData[]> {
    return new Observable( (obserber)=>{
      this.http.get(`${environment.apiUrl}/${url}?bin=${bin}\&movie_id=${id}`)
      .subscribe((datas: Array<any>)=>{
        const commentDatas = datas.map(data=>{
          return new CommentData(data["commentNumber"], data["label"], data["second"], data["messages"]);
        });
        obserber.next(commentDatas);
        return {unsubscribe() {}};
      })
    });
  }
  getAllMovie(): Observable<YoutubeData[]> {
    return new Observable( (observer)=>{
      this.http.get(`${environment.apiUrl}/getMovie`)
      .subscribe((datas: Array<any>)=>{
        const youtubeData = datas.map(data=>{
          return new YoutubeData(data["title"],data["id"],data["commentCount"]);
        });
        observer.next(youtubeData);
        return {unsubscribe() {}};
      })
    });
  }
}
