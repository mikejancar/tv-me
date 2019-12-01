import { BehaviorSubject } from 'rxjs';

import { Component } from '@angular/core';

import { SearchResult } from '../models/search-result.interface';

@Component({
  selector: 'tvme-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent {
  searchResults$: BehaviorSubject<SearchResult[]> = new BehaviorSubject<SearchResult[]>([]);

  onSearchComplete(result: SearchResult[]): void {
    this.searchResults$.next(result);
  }
}
