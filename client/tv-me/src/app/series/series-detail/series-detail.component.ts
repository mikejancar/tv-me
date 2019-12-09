import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { environment } from '@tvme-env/environment';
import { EpisodeService } from '@tvme/episode';
import { EpisodeDetail, SeriesDetail } from '@tvme/models';

import { SeriesService } from '../series.service';

@Component({
  selector: 'tvme-series-detail',
  templateUrl: './series-detail.component.html'
})
export class SeriesDetailComponent implements OnInit {
  series$: Observable<SeriesDetail>;
  nextEpisode$: Observable<EpisodeDetail>;

  imageRoot = environment.tvdbImageRoot;

  constructor(
    private seriesService: SeriesService,
    private episodeService: EpisodeService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.activatedRoute.params.pipe(
      tap((params: Params) => {
        const seriesId = params.id;
        this.series$ = this.seriesService.getSeriesDetail(seriesId);
        this.nextEpisode$ = this.episodeService.getNextEpisode(seriesId);
      })
    ).subscribe();
  }

}
