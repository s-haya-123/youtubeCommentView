import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

class YoutubeThumbnail {
  constructor(
    public title: string,
    public id: string,
  ){}
}
@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  private thumbnails: YoutubeThumbnail[] = [
    new YoutubeThumbnail("title","juRmM7oa2Jg"),
    new YoutubeThumbnail("title","juRmM7oa2Jg"),
    new YoutubeThumbnail("title2","")];
  constructor(private router: Router) { }

  ngOnInit() {
  }
  private movePlay() {
    this.router.navigate(["play"]);
  }

}
