import { Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { SearchResult } from '@tvme/models';

@Component({
  selector: 'tvme-search',
  templateUrl: './search.component.html'
})
export class SearchComponent {
  searchInProgress$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  searchResults$: BehaviorSubject<SearchResult[]> = new BehaviorSubject<SearchResult[]>([]);

  onSearchComplete(result: SearchResult[]): void {
    this.searchResults$.next(result);
  }

  onSearchStatusChange(isRunning: boolean): void {
    this.searchInProgress$.next(isRunning);
  }
}
