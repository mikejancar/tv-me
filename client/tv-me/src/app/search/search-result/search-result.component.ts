import { SearchResult } from 'src/app/models/search-result.interface';

import { Component, Input } from '@angular/core';

@Component({
  selector: 'tvme-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.scss']
})
export class SearchResultComponent {
  @Input() searchResult: SearchResult[] = [];
}
