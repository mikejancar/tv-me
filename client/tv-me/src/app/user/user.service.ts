import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { environment } from '@tvme-env/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  isRegistered$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoggedIn$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) { }

  registerNewUser(emailAddress: string, password: string): Observable<boolean> {
    return this.http.post(`${environment.tvmeApiUrl}/users`, { emailAddress, password }).pipe(
      map(() => {
        this.isRegistered$.next(true);
        this.isLoggedIn$.next(true);
        return true;
      }),
      catchError((error: any) => {
        console.log(error);
        return of(false);
      })
    );
  }
}
