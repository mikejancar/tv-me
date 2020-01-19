import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { SearchResult } from '@tvme/models';
import { UserService } from '@tvme/user';

interface SaveStatus {
  inProcess: boolean;
  wasSuccessful: boolean;
}

@Component({
  selector: 'tvme-search-result',
  templateUrl: './search-result.component.html'
})
export class SearchResultComponent {
  @Input() searchInProgress = false;
  @Input() searchResult: SearchResult[] = [];

  saveStatus$: BehaviorSubject<SaveStatus> = new BehaviorSubject({ inProcess: false, wasSuccessful: false });

  constructor(public router: Router, private userService: UserService) { }

  saveSeries(series: SearchResult): void {
    this.saveStatus$.next({ inProcess: true, wasSuccessful: false });
    this.userService.saveUserSeries(series).pipe(
      map((result: boolean) => this.saveStatus$.next({ inProcess: false, wasSuccessful: true })),
      catchError((error: any) => {
        this.saveStatus$.next({ inProcess: false, wasSuccessful: false });
        return of(false);
      })
    ).subscribe();
  }
}
