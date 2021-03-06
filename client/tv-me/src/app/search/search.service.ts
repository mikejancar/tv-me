import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '@tvme-env/environment';
import { SearchResult } from '@tvme/models';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  constructor(private http: HttpClient) { }

  searchForSeries(name: string): Observable<SearchResult[]> {
    return this.http.get<SearchResult[]>(`${environment.tvmeApiUrl}/series?name=${name}`);
  }
}
