import { YoutubeService } from './../youtube.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { YoutubeData } from '../youtube.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  private thumbnails: YoutubeData[] = [
    new YoutubeData("title","juRmM7oa2Jg"),
    new YoutubeData("title","juRmM7oa2Jg"),
    new YoutubeData("title2","")];
  private thumbnails$: Observable<YoutubeData[]>
  constructor(private router: Router,private youtubeService: YoutubeService) {
    this.thumbnails$ = youtubeService.getAllMovie();
  }

  ngOnInit() {
  }
  private movePlay() {
    this.router.navigate(["play"]);
  }

}
