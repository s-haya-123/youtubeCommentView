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
  youtubeData: YoutubeData;
  title:string;
  constructor(private youtubeService: YoutubeService, private location: Location) { } 
  ngOnInit() {
    this.youtubeData = this.youtubeService.getYoutubeData();
    if(this.youtubeData === undefined) {
      this.location.back();
    }
    this.setCanvasSize();
  }

  savePlayer(player) {
    this.player = player;
    this.setPlayerSize();
    console.log('player instance', player);
  }
  onStateChange(event) {
    console.log('player state', event.data);
  }
  onReceiveSeekSecond(second: number) {
    this.player.seekTo(second, true);
  }
  @HostListener('window:resize',['$event'])
  onresize(_){
    this.setPlayerSize();
  }

  private setPlayerSize() {
    let playerWidth = window.innerWidth * 2 / 3;
    let playerHeight = window.innerHeight / 2;
    this.player.setSize(playerWidth,playerHeight);
  }
  private setCanvasSize() {
    this.canvasWidth = window.innerWidth * 2 / 3;
    this.canvasHeight = 320;
  }

}
