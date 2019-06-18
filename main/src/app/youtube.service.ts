import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

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
    public comments: CommentData[],
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
  private youtubeData: YoutubeData = new YoutubeData("はじめての料理配信【Cooking Simulator】",this.data)
  constructor() { }

  getYoutubeData(): Observable<YoutubeData> {
    return new Observable((observer)=>{
      observer.next(this.youtubeData);
      return {unsubscribe() {}};
    })
  }
}
