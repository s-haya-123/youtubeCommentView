import { PlayComponent } from './play/play.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListComponent } from './list/list.component';
import { TopComponent } from './top/top.component';
const routes: Routes = [
  { path: 'list', component: ListComponent },
  { path: 'play', component: PlayComponent },
  { path: '',  component: TopComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
