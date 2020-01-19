import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, switchMap, take } from 'rxjs/operators';

import { environment } from '@tvme-env/environment';
import { FavoriteSeries, SearchResult, User } from '@tvme/models';

interface UserLogin {
  id: string;
  username: string;
  expiresAt: number;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  user$: BehaviorSubject<User> = new BehaviorSubject<User>({ id: '', username: '', favoriteSeries: [] });
  isRegistered$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoggedIn$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) { }

  checkLoginStatus(): void {
    const now = new Date();
    const userLoginStored = localStorage.getItem('userLogin');

    if (userLoginStored) {
      const userLogin: UserLogin = JSON.parse(userLoginStored);
      if (userLogin.expiresAt > now.getDate()) {
        this.getUser(userLogin.id);
        this.isLoggedIn$.next(true);
      } else {
        this.isLoggedIn$.next(false);
      }
    } else {
      this.isLoggedIn$.next(false);
    }
  }

  getUser(id: string): void {
    this.http.get(`${environment.tvmeApiUrl}/users/${id}`).pipe(
      map((user: User) => {
        this.setUser(user);
      }),
      catchError((error: any) => {
        if (error.status === 404) {
          this.isRegistered$.next(false);
        }
        console.log(error);
        return of(error);
      })
    ).subscribe();
  }

  login(username: string, password: string): Observable<boolean> {
    return this.http.post(`${environment.tvmeApiUrl}/login`, { username, password }).pipe(
      map((user: User) => {
        this.setUser(user);
        return true;
      }),
      catchError((error: any) => {
        this.isLoggedIn$.next(false);
        console.log(error);
        return of(false);
      })
    );
  }

  registerNewUser(username: string, password: string): Observable<boolean> {
    return this.http.post(`${environment.tvmeApiUrl}/users`, { username, password }).pipe(
      map((user: User) => {
        this.saveUserLogin(user);
        this.setUser(user);
        return true;
      }),
      catchError((error: any) => {
        console.log(error);
        return of(false);
      })
    );
  }

  saveUserSeries(series: SearchResult): Observable<boolean> {
    return this.user$.pipe(
      take(1),
      switchMap((user: User) =>
        this.http.patch(`${environment.tvmeApiUrl}/users/${user.id}`, { favoriteSeries: this.updateFavoriteSeries(user, series) }).pipe(
          map((updatedUser: User) => {
            this.user$.next(updatedUser);
            return true;
          }),
          catchError((error: any) => {
            console.log(error);
            return of(false);
          })
        )
      )
    );
  }

  private updateFavoriteSeries(user: User, series: SearchResult): FavoriteSeries[] {
    if (user.favoriteSeries.some((existingSeries: FavoriteSeries) => existingSeries.id === series.id)) {
      return user.favoriteSeries;
    }
    const newFavorite: FavoriteSeries = { id: series.id, seriesName: series.seriesName };
    return [
      ...user.favoriteSeries || [],
      newFavorite
    ];
  }

  private removeUserLogin(): void {
    localStorage.removeItem('user');
  }

  private saveUserLogin(user: User): void {
    const now = new Date();
    const userLogin: UserLogin = {
      id: user.id,
      username: user.username,
      expiresAt: now.setDate(now.getDate() + 7)
    };
    localStorage.setItem('userLogin', JSON.stringify(userLogin));
    this.isLoggedIn$.next(true);
  }

  private setUser(user: User): void {
    this.isRegistered$.next(true);
    this.user$.next(user);
  }
}
