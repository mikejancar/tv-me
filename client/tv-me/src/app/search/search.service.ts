import { Observable } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { SearchResult } from '../models/search-result.interface';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private apiRoot = 'https://apidev.mikejancar.com/tvme';

  constructor(private http: HttpClient) { }

  searchForSeries(name: string): Observable<SearchResult[]> {
    return this.http.get<SearchResult[]>(`${this.apiRoot}/series?name=${name}`);
  }
}
