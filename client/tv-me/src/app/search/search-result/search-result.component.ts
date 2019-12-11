import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

import { SearchResult } from '@tvme/models';

@Component({
  selector: 'tvme-search-result',
  templateUrl: './search-result.component.html'
})
export class SearchResultComponent {
  @Input() searchInProgress = false;
  @Input() searchResult: SearchResult[] = [];

  constructor(public router: Router) { }
}
