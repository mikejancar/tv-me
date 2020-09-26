import { Component, EventEmitter, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { SearchResult } from '@tvme/models';

import { SearchService } from '../search.service';

@Component({
  selector: 'tvme-search-form',
  templateUrl: './search-form.component.html'
})
export class SearchFormComponent {
  @Output() searchInProgress: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() searchComplete: EventEmitter<SearchResult[]> = new EventEmitter<SearchResult[]>();

  searchQuery: string;

  constructor(
    private searchService: SearchService,
    private snackBar: MatSnackBar
  ) { }

  searchSeries(): void {
    this.searchInProgress.emit(true);
    this.searchService.searchForSeries(this.searchQuery).pipe(
      tap((results: SearchResult[]) => {
        this.searchInProgress.emit(false);
        this.searchComplete.emit(results);
      }),
      catchError((error: any) => {
        this.searchInProgress.emit(false);
        this.snackBar.open('There was an error executing the search. Please try again.', 'Series Search', { duration: 5000 });
        return of(error);
      })
    ).subscribe();
  }
}
