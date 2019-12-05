import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SeriesDetailComponent } from './series-detail/series-detail.component';
import { SeriesRoutingModule } from './series-routing.module';
import { SeriesComponent } from './series.component';

@NgModule({
  declarations: [SeriesComponent, SeriesDetailComponent],
  imports: [
    CommonModule,
    SeriesRoutingModule
  ]
})
export class SeriesModule { }
