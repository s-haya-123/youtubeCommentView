import { Component, OnInit } from '@angular/core';

class YoutubeThumbnail {
  constructor(
    public title: string,
    public url: string
  ){}
}
@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  private thumbnails: YoutubeThumbnail[] = [new YoutubeThumbnail("title", "./assets/icon.png"),new YoutubeThumbnail("title2", "./assets/icon.png")];
  constructor() { }

  ngOnInit() {
  }

}
