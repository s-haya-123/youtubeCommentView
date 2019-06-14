import { Component, OnInit } from '@angular/core';
import 'youtube';
@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.scss']
})
export class PlayComponent implements OnInit {
  player:YT.Player;
  done:Boolean = true;
  constructor() { } 
  ngOnInit() {
    let tag = document.createElement('script');
    tag.src = "https://www.youtube.com/embed/fbaoedS3Vcs";
    let firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  }

  onYouTubeIframeAPIReady() {
    this.player = new YT.Player('player', {
      height: '360',
      width: '640',
      videoId: 'M7lc1UVf-VE',
      events: {
        'onReady': this.onPlayerReady,
        'onStateChange': this.onPlayerStateChange
      }
    });
  }
  onPlayerReady(event: YT.PlayerEvent) {
    event.target.playVideo();
  }
  onPlayerStateChange(event: YT.OnStateChangeEvent) {
    if (event.data == YT.PlayerState.PLAYING && !this.done) {
      setTimeout(this.stopVideo, 6000);
      this.done = true;
    }
  }
  stopVideo() {
    this.player.stopVideo();
  }

}
