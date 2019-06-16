import { Component, OnInit, HostListener } from '@angular/core';
import { ChartComponent } from '../chart/chart.component'

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.scss']
})
export class PlayComponent implements OnInit {
  player: YT.Player;
  private id: string = '7QzUKRnY6oU';
  private canvasWidth: number;
  private canvasHeight: number;
  constructor() { } 
  ngOnInit() {
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
  onClick() {
    this.player.seekTo(30,true);
  }
  onReceiveSeekSecond(second: number) {
    this.player.seekTo(second, true);
  }
  @HostListener('window:resize',['$event'])
  onresize(event){
    this.setPlayerSize();
    // this.setCanvasSize();
  }

  private setPlayerSize() {
    let playerWidth = window.innerWidth*2/3;
    let playerHeight = window.innerHeight / 2;
    this.player.setSize(playerWidth,playerHeight);
  }
  private setCanvasSize() {
    this.canvasWidth = window.innerWidth*2/3;
    this.canvasHeight = 320;
  }

}
