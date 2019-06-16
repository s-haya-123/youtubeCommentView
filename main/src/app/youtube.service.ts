import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export class ChartData {
  constructor(
    public commentNumber: number,
    public label: string,
    public second: number
    ) {}
}

@Injectable({
  providedIn: 'root'
})
export class YoutubeService {
  private data:ChartData[] = [
    new ChartData(12,"0:30",30),
    new ChartData(19,"1:00",60),
    new ChartData(3,"1:30",90),
    new ChartData(5,"2:00",120),
    new ChartData(3,"2:30",150),
  ]
  constructor() { }

  comment(): Observable<ChartData[]> {
    return new Observable((observer)=>{
      observer.next(this.data);
      return {unsubscribe() {}};
    })
  }
}
