import { YoutubeService, YoutubeData } from './../youtube.service';
import { Component, OnInit, HostListener } from '@angular/core';
import { Location } from '@angular/common'

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.scss'],
})
export class PlayComponent implements OnInit {
  player: YT.Player;
  canvasWidth: number;
  canvasHeight: number;
  youtubeData: YoutubeData = new YoutubeData("","",-1);
  title:string;
  constructor(private youtubeService: YoutubeService, private location: Location) { } 
  ngOnInit() {
    window.scrollTo({
      top: 0,
      behavior: "auto"
  });
    if(this.youtubeService.getYoutubeData()===undefined) {
      this.location.back();
    } else {
      this.youtubeData = this.youtubeService.getYoutubeData();
      this.setCanvasSize();
    }
  }

  savePlayer(player) {
    this.player = player;
    this.setPlayerSize();
  }
  onStateChange(event) {
  }
  onReceiveSeekSecond(second: number) {
    this.player.seekTo(second, true);
  }
  @HostListener('window:resize',['$event'])
  onresize(_){
    this.setPlayerSize();
    this.setCanvasSize();
  }

  private setPlayerSize() {
    let playerWidth = window.innerWidth * 4 / 5;
    let playerHeight = window.innerHeight / 2;
    this.player.setSize(playerWidth,playerHeight);
  }
  private setCanvasSize() {
    this.canvasWidth = window.innerWidth * 4 / 5;
    this.canvasHeight = window.innerWidth / 2;
  }
}
