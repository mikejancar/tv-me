import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SeriesDetailComponent } from './series-detail/series-detail.component';
import { SeriesComponent } from './series.component';

const routes: Routes = [
  { path: '/series', component: SeriesComponent },
  { path: '/series/:id', component: SeriesDetailComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SeriesRoutingModule { }
