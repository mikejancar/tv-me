import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '@tvme-env/environment';
import { EpisodeDetail } from '@tvme/models';

@Injectable({
  providedIn: 'root'
})
export class EpisodeService {
  constructor(private http: HttpClient) { }

  getNextEpisode(seriesId: number): Observable<EpisodeDetail> {
    return this.http.get<EpisodeDetail>(`${environment.tvmeApiUrl}/series/${seriesId}/episodes/next`);
  }
}
