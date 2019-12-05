import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '@tvme-env/environment';
import { SeriesDetail } from '@tvme/models';

@Injectable({
  providedIn: 'root'
})
export class SeriesService {
  constructor(private http: HttpClient) { }

  getSeriesDetail(id: string): Observable<SeriesDetail> {
    return this.http.get<SeriesDetail>(`${environment.tvmeApiUrl}/series/${id}`);
  }
}
