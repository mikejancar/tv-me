import { Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { SearchResult } from '@tvme/models';

@Component({
  selector: 'tvme-search',
  templateUrl: './search.component.html'
})
export class SearchComponent {
  searchResults$: BehaviorSubject<SearchResult[]> = new BehaviorSubject<SearchResult[]>([]);

  onSearchComplete(result: SearchResult[]): void {
    this.searchResults$.next(result);
  }
}
