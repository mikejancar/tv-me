import { of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { SearchResult } from 'src/app/models/search-result.interface';

import { Component, EventEmitter, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material';

import { SearchService } from '../search.service';

@Component({
  selector: 'tvme-search-form',
  templateUrl: './search-form.component.html',
  styleUrls: ['./search-form.component.scss']
})
export class SearchFormComponent {
  @Output() searchComplete: EventEmitter<SearchResult[]> = new EventEmitter<SearchResult[]>();

  searchQuery: string;

  constructor(
    private searchService: SearchService,
    private snackBar: MatSnackBar
  ) { }

  searchSeries(): void {
    this.searchService.searchForSeries(this.searchQuery).pipe(
      tap((results: SearchResult[]) => this.searchComplete.emit(results)),
      catchError((error: any) => {
        this.snackBar.open('There was an error executing the search. Please try again.', 'Series Search', { duration: 5000 });
        return of(error);
      })
    ).subscribe();
  }
}
