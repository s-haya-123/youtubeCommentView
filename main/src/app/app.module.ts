import { YoutubeService } from './youtube.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PlayComponent } from './play/play.component';

import { NgxYoutubePlayerModule } from 'ngx-youtube-player';
import { ChartComponent } from './chart/chart.component';

import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    PlayComponent,
    ChartComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgxYoutubePlayerModule.forRoot(),
    HttpClientModule,
  ],
  providers: [YoutubeService],
  bootstrap: [AppComponent]
})
export class AppModule { }
