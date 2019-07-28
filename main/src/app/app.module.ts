import { YoutubeService } from './youtube.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PlayComponent } from './play/play.component';

import { NgxYoutubePlayerModule } from 'ngx-youtube-player';
import { ChartComponent } from './chart/chart.component';

import { HttpClientModule } from '@angular/common/http';
import { ListComponent } from './list/list.component';
import { TopComponent } from './top/top.component';

@NgModule({
  declarations: [
    AppComponent,
    PlayComponent,
    ChartComponent,
    ListComponent,
    TopComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgxYoutubePlayerModule.forRoot(),
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
